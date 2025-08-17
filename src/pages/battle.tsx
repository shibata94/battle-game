import * as React from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { Character, CharacterType, StorageKey, BaseIconUrl } from './../components/constants'
import { PlayerActionDto, EnemyActionDto, getEnemyActionKeysByStage, getPlayerActions, getPlayerSelectedAction, getEnemySelectedAction } from './../db/action'
import { JobRecord } from './../db/job'
import { StageRecord } from './../db/stage'
import { PotentialMap, getPotentialByStage } from './../db/potential'
import { checkJobParam, checkStageParam } from './../components/urlParamsCheck'
import { createJobUrl } from './../components/createUrl'
import { IconImg, MessageButton, Message, MenuWrapper, MenuItem } from './../components/design'

const { useState, useMemo, useEffect } = React

  interface Props {
    gameInfo: {
      jobs: Map<string, JobRecord>,
      stages: Map<number, StageRecord>
    }
    setClearMaxStage: (stage: number) => void
  }



export const Battle: React.FC<Props> = (props) => {
  const { gameInfo, setClearMaxStage } = props

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const selectedJob: string | null = params.get('job');
  const selectedStage: number = Number(params.get('stage') ?? -1);

  const clearMaxStageObj = localStorage.getItem(StorageKey)
  const currentClearMaxStage: number = clearMaxStageObj ? JSON.parse(clearMaxStageObj)[selectedJob] ?? 0: 0
console.log(clearMaxStageObj+'：'+currentClearMaxStage)

const jobRedirect = checkJobParam(selectedJob, gameInfo.jobs);
if (jobRedirect) return jobRedirect;

const stageRedirect = checkStageParam(selectedStage, currentClearMaxStage, gameInfo.stages, selectedJob!);
if (stageRedirect) return stageRedirect;

    const [actions, setActions] = useState({
      playerNormal: [] as PlayerActionDto[],
      playerSkill: [] as PlayerActionDto[],
      enemyActionKeys: [] as string[]
    });

  const [potential, setPotential] = useState<PotentialMap>({
      [Character.Player.key]: { maxHP: 0, maxMP: 0 },
      [Character.Enemy.key]: { maxHP: 0, maxMP: 0 }
    })

  const [stats, setStats] = useState({
    [Character.Player.key]: { HP: 0, MP: 0 },
    [Character.Enemy.key]: { HP: 0, MP: 0 },
  });

  useEffect(() => {
    (async () => {
      console.log('useEffectStart')
      const potentialData = await getPotentialByStage(selectedStage)
      setPotential(potentialData)
      console.log('potentialData'+potentialData)

      const playerAllActions: PlayerActionDto[] = await getPlayerActions(potentialData.player.maxHP, potentialData.player.maxMP);
      setActions({
        playerNormal: playerAllActions.filter(action => action.type1 == 'normal'),
        playerSkill: playerAllActions.filter(action => action.type1 == 'skill' && action.job == selectedJob && action.skillReleaseStage <= selectedStage),
        enemyActionKeys: await getEnemyActionKeysByStage(selectedStage)
      });

    setStats({
      [Character.Player.key]: { HP: potentialData.player.maxHP, MP: potentialData.player.maxMP },
      [Character.Enemy.key]: { HP: potentialData.enemy.maxHP, MP: potentialData.enemy.maxMP },
    });
    })();
  }, []);

    //別画面遷移用フック
    const navigate = useNavigate();

    //どっちのターンか（0：プレイヤー、1:敵）
    const [turn, setTurn] = useState(0)

    //メッセージ
    const [message, setMessage] = useState('')
    const [messageModalVisible, setMessageModalVisible] = useState(false)

    //プレイヤー処理継続メッセージ
    const [continueMessage, setContinueMessage] = useState('')
    const [continueMessageModalVisible, setContinueMessageModalVisible] = useState(false)

    //プレイヤー行動
    const [playerActionModalVisible, setPlayerActionModalVisible] = useState(false)

    //戦闘終了
    const [finishMessage, setFinishMessage] = useState('')
    const [finishModalVisible, setFinishModalVisible] = useState(false)

    //スキル
    const [skillModalVisible, setSkillModalVisible] = useState(false)
    

    //ターン変更後の処理
    useEffect(() => {
      if(turn == 0){
        setPlayerActionModalVisible(true)
      }
      if(turn == 1){
        setTimeout(() => {
          enemyAction()
        }, 1000);
      }
    }, [turn])


    const doPlayerAction = async (actionKey: string) => {
        setPlayerActionModalVisible(false)
        setSkillModalVisible(false)
        setContinueMessageModalVisible(false)

        const selectedAction: PlayerActionDto = await getPlayerSelectedAction(actionKey, potential.player.maxHP, potential.player.maxMP);

        doAction(Character.Player, selectedAction);
    }

    const enemyAction = async () => {
      let selectedRamdomActionIndex: number;
      let selectedRamdomAction: EnemyActionDto;

      const enemyActionKeys = actions.enemyActionKeys
console.log(enemyActionKeys)
      const getRandomActionIndex = (): number => {
        return Math.floor(Math.random() * enemyActionKeys.length);
      };
  
      do {
        selectedRamdomActionIndex = getRandomActionIndex();
        console.log(selectedRamdomActionIndex)
        selectedRamdomAction = await getEnemySelectedAction(enemyActionKeys[selectedRamdomActionIndex], potential.enemy.maxHP, potential.enemy.maxMP);
      } while (doAction(Character.Enemy, selectedRamdomAction));
    }

    const finish = (winner: CharacterType, battleMessage: string) => {

      const commonMessage = `■ステージ選択画面に戻ります■`

      let levelUpMessage = ''
      if(winner == Character.Player){
        const isFirstClear: boolean = currentClearMaxStage < selectedStage;
        
        console.log('prev:'+currentClearMaxStage+',selectedStage:'+selectedStage)
        if(isFirstClear){
          levelUpMessage = 'ステージ初回クリアのため、最大HP、最大MP、攻撃力、回復力、使用可能スキルが増えた！\n'
          setClearMaxStage(selectedStage)
          localStorage.setItem(StorageKey, JSON.stringify({ [selectedJob]: selectedStage }))
        }
      }

      const finishMessage = winner == Character.Player ?
        `${Character.Player.label}のかち！\n` + levelUpMessage + commonMessage
        : `${Character.Player.label}のまけ！\n` + commonMessage;

      setFinishMessage(battleMessage + `\n\n` + finishMessage);
      setFinishModalVisible(true)
    }

    const haveEnoughSkillMP = (actor: CharacterType, action: PlayerActionDto | EnemyActionDto): boolean => {
      const actorKey = actor.key
      let notEnoughMP: boolean = false
              console.log(!(stats[actorKey].MP < action.consumptionMP))
              console.log('★'+ stats[actorKey].MP+ ':'+action.consumptionMP)
      if(stats[actorKey].MP < action.consumptionMP){
        notEnoughMP = true
        if(actorKey == Character.Player.key){
          setContinueMessage('MP不足！')
          setContinueMessageModalVisible(true)
          setPlayerActionModalVisible(true) //プレイヤー処理継続のため行動選択モーダルを再度trueに
          setSkillModalVisible(true)
        }
      }
      return !notEnoughMP
    }

    const doAttack = (actor: CharacterType, action: PlayerActionDto | EnemyActionDto): boolean => {
        const actorKey = actor.key
        const target = actor == Character.Player? Character.Enemy : Character.Player
        const targetKey = target.key   

        if(action.type1 == 'skill' && !haveEnoughSkillMP(actor, action)){
          return true //再度行動
        }
    
        const damage = action.damageOrHeal
        const afterHP = stats[targetKey].HP - damage;

        const commonMessage = `${actor.label}が「 ${action.name} 」をおこなった！\n`
        const mpUsageMessage = actorKey == Character.Player.key && action.type1 == 'skill' ? `MPを${action.consumptionMP}消費し、` : '';
    
        if (afterHP <= 0) {
          const battleMessage = commonMessage + mpUsageMessage +
            `${target.label}に${stats[targetKey].HP}のダメージ！\n` +
            `${target.label}をたおした！`;
          setStats(prev => ({
            ...prev,
            [actorKey]: {
              ...prev[actorKey],
              MP: action.type1 == 'skill' 
                ? prev[actorKey].MP - action.consumptionMP
                : prev[actorKey].MP
            },
            [targetKey]: {
                ...prev[targetKey],
                HP: 0
            }
          }));
          finish(actor, battleMessage)
          return false
        } else {
          setMessage(
            commonMessage + mpUsageMessage +
            `${target.label}に${damage}のダメージ！`
          );
          setStats(prev => ({
            ...prev,
            [actorKey]: {
              ...prev[actorKey],
              MP: action.type1 == 'skill' 
                ? prev[actorKey].MP - action.consumptionMP
                : prev[actorKey].MP
            },
            [targetKey]: {
              ...prev[targetKey],
              HP: afterHP
            }
          }));
        }
        setMessageModalVisible(true)
        return false
    }

    const doHeal = (actor: CharacterType, action: PlayerActionDto | EnemyActionDto) => {
        const actorKey = actor.key
        const target = actor //自分自身
        const targetKey = target.key
        const targetPotential = potential[targetKey]

        if(action.type1 == 'skill' && !haveEnoughSkillMP(actor, action)){
          return true //再度行動
        }
    
        const heal = action.damageOrHeal
        const afterHP = stats[targetKey].HP + heal;

        const commonMessage = `${actor.label}が「 ${action.name} 」をおこなった！\n`
        const mpUsageMessage = actorKey == Character.Player.key && action.type1 == 'skill' ? `MPを${action.consumptionMP}消費し、` : '';
    
        if (stats[targetKey].HP === targetPotential.maxHP) {
          //setMessage(
          //  commonMessage +
          //  `しかしHPが満タンのため回復されなかった！（MP消費無し）`
          //);
          if(actorKey == Character.Player.key){
            setContinueMessage('HPが満タン！')
            setContinueMessageModalVisible(true)
            setPlayerActionModalVisible(true) //プレイヤー処理継続のため行動選択モーダルを再度trueに
          }
          return true //再度行動
        } else if (afterHP >= targetPotential.maxHP) {
          setMessage(
            commonMessage + mpUsageMessage +
            `${target.label}が${targetPotential.maxHP - stats[targetKey].HP}回復！`
          );
          setStats(prev => ({
            ...prev,
            [targetKey]: {
              ...prev[targetKey],
              HP: targetPotential.maxHP,
              MP: action.type1 == 'skill' 
                ? prev[actorKey].MP - action.consumptionMP
                : prev[actorKey].MP
            }
          }));
        } else {
          setMessage(
            commonMessage + mpUsageMessage +
            `${target.label}が${heal}回復！`
          );
          setStats(prev => ({
            ...prev,
            [targetKey]: {
              ...prev[targetKey],
              HP: afterHP,
              MP: action.type1 == 'skill' 
                ? prev[actorKey].MP - action.consumptionMP
                : prev[actorKey].MP}
          }));
        }
        setMessageModalVisible(true)
        return false
    }
    const doAction = (actor: CharacterType, action: PlayerActionDto | EnemyActionDto): boolean => {
      const retryAction = action.type2 == 'attack' ? doAttack(actor, action) : doHeal(actor, action)
      return retryAction
    };
    

      const hpPct = useMemo(
        () => Math.max(0, Math.min(100, (stats.player.HP / potential.player.maxHP) * 100)),
        [stats.player.HP]
      );
      const mpPct = useMemo(
        () => Math.max(0, Math.min(100, (stats.player.MP / potential.player.maxMP) * 100)),
        [stats.player.MP]
      );
      const enemyHpPct = useMemo(
        () => Math.max(0, Math.min(100, (stats.enemy.HP / potential.enemy.maxHP) * 100)),
        [stats.enemy.HP]
      );
    
      const Bar = ({ label, valueText, pct, colorClass }) => (
        <div className="w-full space-y-1">
          <div className="flex items-end justify-between text-xs text-gray-500">
            <span>{label}</span>
            <span>{valueText}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200 shadow-inner">
            <input
              className={`h-3 rounded-full ${colorClass}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    
      return (
        <div className="min-h-[70vh] w-full bg-neutral-100 p-4 sm:p-6">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 rounded-2xl bg-white p-4 shadow-lg sm:grid-cols-2 sm:p-6">
              {/* プレイヤー側 */}
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-bold">{Character.Player.label}</h2>
                  </div>
                  <div className="space-y-3">
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
                  </div>
                </div>
      
                <div className="flex flex-1 items-center gap-4">
                  <div className="flex h-40 w-32 items-center justify-center rounded-2xl border bg-gradient-to-br from-gray-50 to-gray-200 text-3xl font-bold shadow-inner">
                    <IconImg src={gameInfo.jobs.get(selectedJob).iconUrl} alt="プレイヤーアイコン" />
                  </div>
      
                  {playerActionModalVisible &&
                    <div className="flex-1 rounded-2xl border p-4 shadow-sm">
                    <h3 className="mb-2 text-sm font-semibold text-gray-500">
                      行動選択
                    </h3>
<MenuWrapper>
  {actions.playerNormal.map(normalAction => (
    <MenuItem
      key={normalAction.key}
      onClick={() => doPlayerAction(normalAction.key)}
    >
      {normalAction.name}
    </MenuItem>
  ))}

  <MenuItem onClick={() => setSkillModalVisible(true)}>
    スキル
  </MenuItem>
</MenuWrapper>
                    </div>
                  }
                </div>
              </div>
                  {/* スキル選択モーダル */}
                  {skillModalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-4 rounded-xl">
                        <h3 className="text-lg font-bold mb-2">スキルを選択</h3>
                        <MenuWrapper>
                          {actions.playerSkill.map(skillAction => (
                            <MenuItem
                              key={skillAction.key}
                              onClick={() => doPlayerAction(skillAction.key)}
                            >
                              {skillAction.name} {skillAction.consumptionMP}
                            </MenuItem>
                          ))}
                          <MenuItem
                            onClick={() => setSkillModalVisible(false)}
                          >
                            とじる
                          </MenuItem>
                        </MenuWrapper>
                      </div>
                    </div>
                  )}

              {/* 敵側 */}
              <div className="flex flex-col items-end gap-4">
                <div className="w-full rounded-2xl border p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-bold">{Character.Enemy.label}</h2>
                  </div>
                  <div className="space-y-3">
                    <Bar
                      label="HP"
                      valueText={`${stats.enemy.HP} / ${potential.enemy.maxHP}`}
                      pct={enemyHpPct}
                      colorClass="bg-gradient-to-r from-emerald-400 to-emerald-600"
                    />
                  </div>
                </div>
      
                <div className="flex h-56 w-40 items-center justify-center rounded-2xl border bg-gradient-to-br from-gray-50 to-gray-200 text-3xl font-bold shadow-inner">
                  <IconImg src={gameInfo.stages.get(selectedStage).enemyIconUrl} alt="敵アイコン" />
                </div>
              </div>
            </div>
            {continueMessageModalVisible && 
              <Message style={{ whiteSpace: "pre-wrap" }}>
                {continueMessage}
              </Message>
            }
            {finishModalVisible && 
              <MessageButton onClick={() => navigate(createJobUrl(selectedJob))} style={{ whiteSpace: "pre-wrap" }}>
                {finishMessage}
              </MessageButton>
            }
            {messageModalVisible && 
              <MessageButton onClick={() => {
                  setMessageModalVisible(false); //メッセージモーダル非表示
                  setTurn(turn == 0 ? 1 : 0); //ターン変更
                }} style={{ whiteSpace: "pre-wrap" }}>
                {message}
              </MessageButton>
            }
        </div>
      );
    }