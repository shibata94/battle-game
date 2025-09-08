import * as React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Character,
  CharacterType,
  StorageKey,
  BaseIconUrl,
  BaseSoundUrl,
  ContinueGuideMessage,
  FinishGuideMessage,
} from "./../components/constants";
import {
  PlayerActionDto,
  EnemyActionDto,
  getEnemyActionKeysByStage,
  getPlayerActions,
  getPlayerSelectedAction,
  getEnemySelectedAction,
} from "./../db/action";
import { JobRecord } from "./../db/job";
import { StageRecord } from "./../db/stage";
import { PotentialMap, getPotentialByStage } from "./../db/potential";
import { checkJobParam, checkStageParam } from "./../components/urlParamsCheck";
import { createJobUrl } from "./../components/createUrl";
import {
  IconImg,
  MessageButton,
  Message,
  MenuWrapper,
  MenuItem,
  SideBySideContainer,
  SideBySideBox,
  Effect,
  SubMenu,
} from "./../components/design";

const { useState, useMemo, useEffect } = React;

interface Props {
  gameInfo: {
    jobs: Map<string, JobRecord>;
    stages: Map<number, StageRecord>;
  };
  setClearMaxStage: (stage: number) => void;
}

  const Bar = ({ label, valueText, pct, colorClass }) => (
    <div className="w-full space-y-1">
      <div className="flex items-end justify-between text-xs text-gray-500">
        <span>{label} {valueText}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 shadow-inner">
        <Bar2 pct={pct} />
      </div>
    </div>
  );

  const Bar2 = styled.div<{ pct: number }>`
    background-color: white;
    width: ${props => props.pct}%;
    height: 25px
`;

  const BarWrapper = styled.div`
    height: 100px;
    margin-bottom: 30px
`;

  const IconWrapper = styled.div`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    margin: 0 auto
`;

export const Battle: React.FC<Props> = (props) => {
  const { gameInfo, setClearMaxStage } = props;

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const selectedJob: string | null = params.get("job");
  const selectedStage: number = Number(params.get("stage") ?? -1);

  const clearMaxStageObj = localStorage.getItem(StorageKey);
  const currentClearMaxStage: number = clearMaxStageObj
    ? JSON.parse(clearMaxStageObj)[selectedJob] ?? 0
    : 0;
  console.log(clearMaxStageObj + "：" + currentClearMaxStage);

  const jobRedirect = checkJobParam(selectedJob, gameInfo.jobs);
  if (jobRedirect) return jobRedirect;

  const stageRedirect = checkStageParam(
    selectedStage,
    currentClearMaxStage,
    gameInfo.stages,
    selectedJob!
  );
  if (stageRedirect) return stageRedirect;

  const [actions, setActions] = useState({
    playerNormal: [] as PlayerActionDto[],
    playerSkill: [] as PlayerActionDto[],
    enemyActionKeys: [] as string[],
  });

  const [potential, setPotential] = useState<PotentialMap>({
    [Character.Player.key]: { maxHP: 0, maxMP: 0 },
    [Character.Enemy.key]: { maxHP: 0, maxMP: 0 },
  });

  const [stats, setStats] = useState({
    [Character.Player.key]: { HP: 0, MP: 0 },
    [Character.Enemy.key]: { HP: 0, MP: 0 },
  });

  //最大開放ステージ（既にクリア済みのステージをプレイする時は、最大クリアステージの能力・スキルの状態でプレイできる）
  const maxUnlockStage = selectedStage > currentClearMaxStage ? selectedStage : currentClearMaxStage + 1;
  console.log('maxUnlockStage:'+maxUnlockStage)

  useEffect(() => {
    (async () => {
      console.log("useEffectStart");
      const potentialData = await getPotentialByStage(selectedStage, maxUnlockStage);
      setPotential(potentialData);
      console.log("potentialData" + potentialData);

      const playerAllActions: PlayerActionDto[] = await getPlayerActions(
        potentialData.player.maxHP,
        potentialData.player.maxMP
      );
      setActions({
        playerNormal: playerAllActions.filter(
          (action) => action.type1 == "normal"
        ),
        playerSkill: playerAllActions.filter(
          (action) =>
            action.type1 == "skill" &&
            action.job == selectedJob &&
            action.skillReleaseStage <= maxUnlockStage
        ).sort((a, b) => a.multiplier - b.multiplier),
        enemyActionKeys: await getEnemyActionKeysByStage(selectedStage),
      });

      setStats({
        [Character.Player.key]: {
          HP: potentialData.player.maxHP,
          MP: potentialData.player.maxMP,
        },
        [Character.Enemy.key]: {
          HP: potentialData.enemy.maxHP,
          MP: potentialData.enemy.maxMP,
        },
      });
    })();
  }, []);

  //別画面遷移用フック
  const navigate = useNavigate();

  //どっちのターンか（0：プレイヤー、1:敵）
  const [turn, setTurn] = useState(0);

  //メッセージ
  const [message, setMessage] = useState("");
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  //プレイヤー処理継続メッセージ
  const [continueMessage, setContinueMessage] = useState("");
  const [continueMessageModalVisible, setContinueMessageModalVisible] =
    useState(false);

  //プレイヤー行動
  const [playerActionModalVisible, setPlayerActionModalVisible] =
    useState(false);

  //戦闘終了
  const [finishMessage, setFinishMessage] = useState("");
  const [finishModalVisible, setFinishModalVisible] = useState(false);

  useEffect(() => {
    if (finishModalVisible) {

    setTimeout(() => {
      if(finishMessage.includes("かち！")){
        if(finishMessage.includes("初回クリア")){
          playSound('first_win.mp3');
        }
        else {
          playSound('win.mp3');
        }
      } else{
        playSound('lose.mp3');
      }
    }, 700);

    }
  }, [finishModalVisible]);
  
  //スキル
  const [skillModalVisible, setSkillModalVisible] = useState(false);

  //エフェクト
const [effect, setEffect] = useState<{
  type: 'attack' | 'heal';
  target: 'player' | 'enemy';
}>(null);

const playAttackOrHealSound = (type: 'attack' | 'heal') => {
  const audio = new Audio(`${BaseSoundUrl}SE/${type}.mp3`);
  audio.play();
};

const playSound = (soundFileName: string) => {
  const audio = new Audio(`${BaseSoundUrl}SE/${soundFileName}`);
  audio.play();
};

  //ターン変更後の処理
  useEffect(() => {
    if (turn == 0) {
      setPlayerActionModalVisible(true);
    }
    if (turn == 1) {
      setTimeout(() => {
        enemyAction();
      }, 1000);
    }
  }, [turn]);

  const doPlayerAction = async (actionKey: string) => {
    setPlayerActionModalVisible(false);
    setSkillModalVisible(false);
    setContinueMessageModalVisible(false);

    const selectedAction: PlayerActionDto = await getPlayerSelectedAction(
      actionKey,
      potential.player.maxHP,
      potential.player.maxMP
    );

    doAction(Character.Player, selectedAction);
  };

  const enemyAction = async () => {
    let selectedRamdomActionIndex: number;
    let selectedRamdomAction: EnemyActionDto;

    const enemyActionKeys = actions.enemyActionKeys;
    console.log(enemyActionKeys);
    const getRandomActionIndex = (): number => {
      return Math.floor(Math.random() * enemyActionKeys.length);
    };

    do {
      selectedRamdomActionIndex = getRandomActionIndex();
      console.log(selectedRamdomActionIndex);
      selectedRamdomAction = await getEnemySelectedAction(
        enemyActionKeys[selectedRamdomActionIndex],
        potential.enemy.maxHP,
        potential.enemy.maxMP
      );
    } while (doAction(Character.Enemy, selectedRamdomAction));
  };

  const finish = (winner: CharacterType, battleMessage: string) => {
    let levelUpMessage = "";

    if (winner == Character.Player) {
      const isFirstClear: boolean = currentClearMaxStage < selectedStage;

      console.log(
        "prev:" + currentClearMaxStage + ",selectedStage:" + selectedStage
      );
      if (isFirstClear) {
        levelUpMessage =
          "ステージ 初回クリア のため 最大HP 最大MP 攻撃力 回復力 使用可能スキル が増えた！\n";
        setClearMaxStage(selectedStage);
        localStorage.setItem(
          StorageKey,
          JSON.stringify({ [selectedJob]: selectedStage })
        );
      }
    }

    const finishMessage =
      winner == Character.Player
        ? `${Character.Player.label} の かち！\n` +
          levelUpMessage +
          FinishGuideMessage
        : `${Character.Player.label} の まけ！\n` + FinishGuideMessage;

    setFinishMessage(battleMessage + `\n\n` + finishMessage);
    setFinishModalVisible(true);
  };

  const haveEnoughSkillMP = (
    actor: CharacterType,
    action: PlayerActionDto | EnemyActionDto
  ): boolean => {
    const actorKey = actor.key;
    let notEnoughMP: boolean = false;
    console.log(!(stats[actorKey].MP < action.consumptionMP));
    console.log("★" + stats[actorKey].MP + ":" + action.consumptionMP);
    if (stats[actorKey].MP < action.consumptionMP) {
      notEnoughMP = true;
      if (actorKey == Character.Player.key) {
        setContinueMessage("MP不足！\n" + ContinueGuideMessage);
        setContinueMessageModalVisible(true);
        setPlayerActionModalVisible(true); //プレイヤー処理継続のため行動選択モーダルを再度trueに
        setSkillModalVisible(true);
      }
    }
    return !notEnoughMP;
  };

  const doAttack = (
    actor: CharacterType,
    action: PlayerActionDto | EnemyActionDto
  ): boolean => {
    const actorKey = actor.key;
    const target =
      actor == Character.Player ? Character.Enemy : Character.Player;
    const targetKey = target.key;

    if (action.type1 == "skill" && !haveEnoughSkillMP(actor, action)) {
      return true; //再度行動
    }

    const damage = action.damageOrHeal;
    const afterHP = stats[targetKey].HP - damage;

    const commonMessage = `${actor.label} が「 ${action.name} 」を おこなった！\n`;
    const mpUsageMessage =
      actorKey == Character.Player.key && action.type1 == "skill"
        ? `MP を ${action.consumptionMP} 消費し `
        : "";

  setEffect({ type: 'attack', target: targetKey});
  playAttackOrHealSound('attack');
  setTimeout(() => setEffect(null), 500);

    if (afterHP <= 0) {
      const battleMessage =
        commonMessage +
        mpUsageMessage +
        `${target.label} に ${stats[targetKey].HP} の ダメージ！\n` +
        `${target.label} を たおした！`;
      setStats((prev) => ({
        ...prev,
        [actorKey]: {
          ...prev[actorKey],
          MP:
            action.type1 == "skill"
              ? prev[actorKey].MP - action.consumptionMP
              : prev[actorKey].MP,
        },
        [targetKey]: {
          ...prev[targetKey],
          HP: 0,
        },
      }));
      finish(actor, battleMessage);
      return false;
    } else {
      setMessage(
        commonMessage +
          mpUsageMessage +
          `${target.label} に ${damage} の ダメージ！`
      );
      setStats((prev) => ({
        ...prev,
        [actorKey]: {
          ...prev[actorKey],
          MP:
            action.type1 == "skill"
              ? prev[actorKey].MP - action.consumptionMP
              : prev[actorKey].MP,
        },
        [targetKey]: {
          ...prev[targetKey],
          HP: afterHP,
        },
      }));
    }

    setMessageModalVisible(true);
    return false;
  };

  const doHeal = (
    actor: CharacterType,
    action: PlayerActionDto | EnemyActionDto
  ) => {
    const actorKey = actor.key;
    const target = actor; //自分自身
    const targetKey = target.key;
    const targetPotential = potential[targetKey];

    if (action.type1 == "skill" && !haveEnoughSkillMP(actor, action)) {
      return true; //再度行動
    }

    const heal = action.damageOrHeal;
    const afterHP = stats[targetKey].HP + heal;

    const commonMessage = `${actor.label} が「 ${action.name} 」を おこなった！\n`;
    const mpUsageMessage =
      actorKey == Character.Player.key && action.type1 == "skill"
        ? `MP を ${action.consumptionMP} 消費し `
        : "";

    if (stats[targetKey].HP === targetPotential.maxHP) {
      if (actorKey == Character.Player.key) {
        setContinueMessage("HP が すでに 満タン！\n" + ContinueGuideMessage);
        setContinueMessageModalVisible(true);
        setPlayerActionModalVisible(true); //プレイヤー処理継続のため行動選択モーダルを再度trueに
      }
      return true; //再度行動
    } else if (afterHP >= targetPotential.maxHP) {
      setMessage(
        commonMessage +
          mpUsageMessage +
          `${target.label} が ${
            targetPotential.maxHP - stats[targetKey].HP
          } 回復！`
      );
      setStats((prev) => ({
        ...prev,
        [targetKey]: {
          ...prev[targetKey],
          HP: targetPotential.maxHP,
          MP:
            action.type1 == "skill"
              ? prev[actorKey].MP - action.consumptionMP
              : prev[actorKey].MP,
        },
      }));
    } else {
      setMessage(
        commonMessage + mpUsageMessage + `${target.label} が ${heal} 回復！`
      );
      setStats((prev) => ({
        ...prev,
        [targetKey]: {
          ...prev[targetKey],
          HP: afterHP,
          MP:
            action.type1 == "skill"
              ? prev[actorKey].MP - action.consumptionMP
              : prev[actorKey].MP,
        },
      }));
    }

  setEffect({ type: 'heal', target: targetKey });
  playAttackOrHealSound('heal');
  setTimeout(() => setEffect(null), 500);

    setMessageModalVisible(true);
    return false;
  };

  const doAction = (
    actor: CharacterType,
    action: PlayerActionDto | EnemyActionDto
  ): boolean => {
    const retryAction =
      action.type2 == "attack"
        ? doAttack(actor, action)
        : doHeal(actor, action);
    return retryAction;
  };

  const hpPct = useMemo(
    () =>
      Math.max(
        0,
        Math.min(100, (stats.player.HP / potential.player.maxHP) * 100)
      ),
    [stats.player.HP]
  );
  const mpPct = useMemo(
    () =>
      Math.max(
        0,
        Math.min(100, (stats.player.MP / potential.player.maxMP) * 100)
      ),
    [stats.player.MP]
  );
  const enemyHpPct = useMemo(
    () =>
      Math.max(
        0,
        Math.min(100, (stats.enemy.HP / potential.enemy.maxHP) * 100)
      ),
    [stats.enemy.HP]
  );

  return (
    <div className="min-h-[70vh] w-full bg-neutral-100 p-4 sm:p-6">
      <SideBySideContainer>
        {/* プレイヤー側 */}
        <SideBySideBox>
          <div className="rounded-2xl border p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-bold">{Character.Player.label}</h2>
            </div>
            <BarWrapper>
              <Bar
                label="HP"
                valueText={`${stats.player.HP} / ${potential.player.maxHP}`}
                pct={hpPct}
                colorClass="bg-gradient-to-r from-emerald-400 to-emerald-600"
              />
              <Bar
                label="MP"
                valueText={`${stats.player.MP} / ${potential.player.maxMP}`}
                pct={mpPct}
                colorClass="bg-gradient-to-r from-sky-400 to-indigo-500"
              />
            </BarWrapper>
          <IconWrapper>
            <IconImg
              src={gameInfo.jobs.get(selectedJob).iconUrl}
              alt="プレイヤーアイコン"
            />
            {effect?.target === Character.Player.key && <Effect type={effect.type} />}
          </IconWrapper>          
          </div>


        </SideBySideBox>

        {/* 敵側 */}
        <SideBySideBox>
          <div className="w-full rounded-2xl border p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-bold">{Character.Enemy.label}</h2>
            </div>
            <BarWrapper>
              <Bar
                label="HP"
                valueText={`${stats.enemy.HP} / ${potential.enemy.maxHP}`}
                pct={enemyHpPct}
                colorClass="bg-gradient-to-r from-emerald-400 to-emerald-600"
              />
            </BarWrapper>
          </div>

          <IconWrapper>
            <IconImg
              src={gameInfo.stages.get(selectedStage).enemyIconUrl}
              alt="敵アイコン"
            />
            {effect?.target === Character.Enemy.key && <Effect type={effect.type} />}
          </IconWrapper>
        </SideBySideBox>
      </SideBySideContainer>

      {playerActionModalVisible && (
        <div className="flex-1 rounded-2xl border p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            コマンド
          </h3>
          <div className="flex">
            <MenuWrapper>
              {actions.playerNormal.map((normalAction) => (
                <MenuItem
                  key={normalAction.key}
                  onClick={() => doPlayerAction(normalAction.key)}
                >
                  {normalAction.name}
                </MenuItem>
              ))}

              <MenuItem onClick={() => setSkillModalVisible(!skillModalVisible)}>
                スキル ▶
              </MenuItem>
              <MenuItem onClick={() => {
                playSound('nigeru.mp3');
                navigate(createJobUrl(selectedJob));
              }}>
                にげる
              </MenuItem>
            </MenuWrapper>
            {/* スキル選択モーダル */}
            <SubMenu open={skillModalVisible}>
              <MenuWrapper>
                {actions.playerSkill.map((skillAction) => (
                  <MenuItem
                    key={skillAction.key}
                    onClick={() => doPlayerAction(skillAction.key)}
                  >
                    {skillAction.name} {skillAction.consumptionMP}
                  </MenuItem>
                ))}
                <MenuItem onClick={() => setSkillModalVisible(false)}>
                  とじる
                </MenuItem>
              </MenuWrapper>
            </SubMenu>
          </div>
        </div>
      )}

      {continueMessageModalVisible && (
        <Message style={{ whiteSpace: "pre-wrap" }}>{continueMessage}</Message>
      )}
      {finishModalVisible && (
        <MessageButton
          onClick={() => navigate(createJobUrl(selectedJob))}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {finishMessage}
        </MessageButton>
      )}
      {messageModalVisible && (
        <MessageButton
          onClick={() => {
            setMessageModalVisible(false); //メッセージモーダル非表示
            setTurn(turn == 0 ? 1 : 0); //ターン変更
          }}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {message}
        </MessageButton>
      )}
    </div>
  );
};
