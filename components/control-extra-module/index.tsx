import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { SelectJumpCount } from '../select-jump-count';

import { DownState, RebootState } from '@/constants';
import { Command } from '@/constants/command';
import useStore, { initWorkParams } from '@/store';
import { ROBOT_CURRENT_MODE, ROBOT_WORK_MODE } from '@/types';
import { globalGetConnect, sendCmdDispatch } from '@/utils/helper';
import { showNotifier } from '@/utils/notifier';
import { SocketManage } from '@/utils/socketManage';

export const ControlExtraModule = () => {
  const { robotStatus, workParams, setWorkParams } = useStore((state) => state);
  const { t } = useTranslation();
  const isInLockedMode = () => {
    if (robotStatus.currentMode === ROBOT_CURRENT_MODE.LOCKED) {
      showNotifier({
        title: t('errors.lockModeTips'),
        type: 'error',
        duration: 3000,
        onPress: () => {},
      });
      return true;
    }
    return false;
  };

  const robotReset = () => {
    if (isInLockedMode()) {
      return;
    }

    if (workParams.auto_find_point) {
      showNotifier({
        title: t('errors.autoFindPointTips3'),
        type: 'error',
        duration: 3000,
        onPress: () => {},
      });
      return;
    }

    if (robotStatus.downState === DownState.finish) {
      sendCmdDispatch(Command.machineReboot);
      setWorkParams({
        ...initWorkParams,
      });
      SocketManage.getInstance().disconnectSocket();
      setTimeout(() => {
        globalGetConnect();
        // 10s后重新连接
      }, 10000);
    }
  };

  const robotDown = () => {
    if (isInLockedMode()) {
      return;
    }

    if (workParams.auto_find_point) {
      showNotifier({
        title: t('errors.autoFindPointTips2'),
        type: 'error',
        duration: 3000,
        onPress: () => {},
      });
      return;
    }
    sendCmdDispatch(Command.machineDescent);
  };

  const robotReboot = () => {
    if (isInLockedMode()) {
      return;
    }

    if (workParams.auto_find_point) {
      showNotifier({
        title: t('errors.autoFindPointTips'),
        type: 'error',
        duration: 3000,
        onPress: () => {},
      });
      return;
    }
    if (robotStatus.rebootState === RebootState.finish) {
      sendCmdDispatch(Command.lashedReboot);
    }
  };

  return (
    <View className="relative flex w-full flex-row items-end justify-end">
      <View className="-bottom-[10px] flex gap-y-5">
        <Button icon="reload" mode="elevated" onPress={robotReboot}>
          {t('common.tyingRobotRestart')}
        </Button>
        <Button icon="restart" mode="elevated" onPress={robotReset}>
          {t('common.machineRestart')}
        </Button>
        <Button icon="elevator-down" mode="elevated" onPress={robotDown}>
          {t('common.machineDown')}
        </Button>
      </View>

      {robotStatus.currentMode === ROBOT_CURRENT_MODE.AUTO &&
      robotStatus.currentBindingMode === ROBOT_WORK_MODE.SKIP_BINDING ? (
        <View className="absolute left-0 top-0">
          <SelectJumpCount />
        </View>
      ) : null}
    </View>
  );
};
