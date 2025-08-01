import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
// import { Icon } from 'react-native-paper';

// import { GlobalSnackbarManager } from '../snackbar-global';

import { TouchableRipple } from 'react-native-paper';

import { ChangeState } from '@/constants';
import { Command } from '@/constants/command';
import useStore from '@/store';
import { DIRECTION } from '@/types';
import { debounce, sendCmdDispatch } from '@/utils/helper';
interface ControlAutoSelectDirectionProps {
  onStart: () => void;
}

export const ControlAutoSelectDirection = ({ onStart }: ControlAutoSelectDirectionProps) => {
  const { robotStatus } = useStore((state) => state);
  const { t } = useTranslation();
  const handlePlay = () => {
    // let count = 0;
    // let mutualExclusion = false;
    // robotStatus.direction.forEach((val, direction) => {
    //   if (val) {
    //     count++;
    //   }
    //   if (
    //     direction === DIRECTION.UP &&
    //     val === true &&
    //     robotStatus.direction.get(DIRECTION.DOWN) === true
    //   ) {
    //     mutualExclusion = true;
    //   }

    //   if (
    //     direction === DIRECTION.LEFT &&
    //     val === true &&
    //     robotStatus.direction.get(DIRECTION.RIGHT) === true
    //   ) {
    //     mutualExclusion = true;
    //   }

    //   if (
    //     direction === DIRECTION.RIGHT &&
    //     val === true &&
    //     robotStatus.direction.get(DIRECTION.LEFT) === true
    //   ) {
    //     mutualExclusion = true;
    //   }

    //   if (
    //     direction === DIRECTION.DOWN &&
    //     val === true &&
    //     robotStatus.direction.get(DIRECTION.UP) === true
    //   ) {
    //     mutualExclusion = true;
    //   }
    // });

    // if (count === 0) {
    //   GlobalSnackbarManager.current?.show({
    //     content: '必须选择一个方向',
    //   });
    //   return;
    // }

    // if (count > 2) {
    //   GlobalSnackbarManager.current?.show({
    //     content: '你只能选择2个方向',
    //   });
    //   return;
    // }

    // if (mutualExclusion) {
    //   GlobalSnackbarManager.current?.show({
    //     content: '你只能选择2个不互斥的方向',
    //   });
    //   return;
    // }

    // 开始

    onStart();
  };

  const directionClick = (direction: DIRECTION) => {
    // setRobotStatus({
    //   direction: new Map(robotStatus.direction).set(
    //     direction,
    //     !robotStatus.direction.get(direction)
    //   ),
    // });
  };

  const switchLeftOrRight = debounce((direction: DIRECTION) => {
    if (direction === DIRECTION.LEFT) {
      // 左右移动要等变轨完成
      if (robotStatus.changeState === ChangeState.finish) {
        sendCmdDispatch(Command.goLeft);
      }
    } else if (direction === DIRECTION.RIGHT) {
      if (robotStatus.changeState === ChangeState.finish) {
        sendCmdDispatch(Command.goRight);
      }
    }
  }, 400);

  const switchTop = (isPressed: boolean) => {
    if (isPressed) {
      sendCmdDispatch(Command.goForward);
    } else {
      sendCmdDispatch(Command.release);
    }
  };

  const switchDown = (isPressed: boolean) => {
    if (isPressed) {
      sendCmdDispatch(Command.goBack);
    } else {
      sendCmdDispatch(Command.release);
    }
  };

  return (
    <View className="relative mt-12 flex flex-row items-center justify-center gap-x-5">
      <View className="absolute left-0 top-0 h-full w-full flex-col items-center justify-center gap-y-10">
        <TouchableRipple
          onPress={() => switchTop(true)}
          centered
          style={{ top: -30 }}
          className="rounded-full px-2 py-2"
          borderless
          rippleColor="rgba(0, 0, 0, .32)">
          <Image
            source={require('@/assets/icon/top-arrow.png')}
            style={{ width: 50, height: 50 }}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => switchDown(true)}
          centered
          style={{ top: 30 }}
          className="rounded-full px-2 py-2"
          borderless
          rippleColor="rgba(0, 0, 0, .32)">
          <Image
            source={require('@/assets/icon/down-arrow.png')}
            style={{ width: 50, height: 50 }}
          />
        </TouchableRipple>
      </View>

      {/*  */}
      <View
        // onPress={handlePlay}
        className="relative flex w-full flex-row items-center justify-center opacity-0">
        <View className="flex">
          {robotStatus.isWorking ? (
            <View className="flex h-[80px] w-[80px] flex-row items-center justify-center rounded-full bg-[#012641]">
              {/* <Icon source="pause" color="#ffffff" size={22} /> */}
              <Text className="ml-1 text-center text-xl font-normal text-white">
                {t('common.pause')}
              </Text>
            </View>
          ) : (
            <View className="flex h-[80px] w-[80px] flex-row items-center justify-center rounded-full bg-[#012641]">
              {/* <Icon source="play" color="#ffffff" size={22} /> */}
              <Text className="ml-1 text-center text-xl font-normal text-white">
                {t('common.start')}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity className="absolute -bottom-2 flex rounded-full">
        <Image
          source={require('@/assets/direction_tags.png')}
          style={{ width: 100, height: 100 }}
        />
      </TouchableOpacity>

      <View className="absolute left-0 top-0 h-full w-full flex-row items-center justify-center gap-x-10">
        <TouchableRipple
          onPress={() => switchLeftOrRight(DIRECTION.LEFT)}
          centered
          style={{ left: -30 }}
          className="rounded-full px-2 py-2"
          borderless
          rippleColor="rgba(0, 0, 0, .32)">
          <Image
            source={require('@/assets/icon/left-arrow.png')}
            style={{ width: 50, height: 50 }}
          />
        </TouchableRipple>
        <TouchableRipple
          onPress={() => switchLeftOrRight(DIRECTION.RIGHT)}
          centered
          style={{ left: 30 }}
          className="rounded-full px-2 py-2"
          borderless
          rippleColor="rgba(0, 0, 0, .32)">
          <Image
            source={require('@/assets/icon/right-arrow.png')}
            style={{ width: 50, height: 50 }}
          />
        </TouchableRipple>
      </View>
    </View>
  );
};
