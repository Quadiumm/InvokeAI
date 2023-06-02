import { Flex } from '@chakra-ui/react';
import IAISlider from 'common/components/IAISlider';
import { ChangeEvent, memo, useCallback } from 'react';
import { useProcessorNodeChanged } from '../hooks/useProcessorNodeChanged';
import { RequiredPidiImageProcessorInvocation } from 'features/controlNet/store/types';
import IAISwitch from 'common/components/IAISwitch';
import { CONTROLNET_PROCESSORS } from 'features/controlNet/store/constants';

const DEFAULTS = CONTROLNET_PROCESSORS.pidi_image_processor.default;

type Props = {
  controlNetId: string;
  processorNode: RequiredPidiImageProcessorInvocation;
};

const PidiProcessor = (props: Props) => {
  const { controlNetId, processorNode } = props;
  const { image_resolution, detect_resolution, scribble, safe } = processorNode;
  const processorChanged = useProcessorNodeChanged();

  const handleDetectResolutionChanged = useCallback(
    (v: number) => {
      processorChanged(controlNetId, { detect_resolution: v });
    },
    [controlNetId, processorChanged]
  );

  const handleImageResolutionChanged = useCallback(
    (v: number) => {
      processorChanged(controlNetId, { image_resolution: v });
    },
    [controlNetId, processorChanged]
  );

  const handleDetectResolutionReset = useCallback(() => {
    processorChanged(controlNetId, {
      detect_resolution: DEFAULTS.detect_resolution,
    });
  }, [controlNetId, processorChanged]);

  const handleImageResolutionReset = useCallback(() => {
    processorChanged(controlNetId, {
      image_resolution: DEFAULTS.image_resolution,
    });
  }, [controlNetId, processorChanged]);

  const handleScribbleChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      processorChanged(controlNetId, { scribble: e.target.checked });
    },
    [controlNetId, processorChanged]
  );

  const handleSafeChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      processorChanged(controlNetId, { safe: e.target.checked });
    },
    [controlNetId, processorChanged]
  );

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <IAISlider
        label="Detect Resolution"
        value={detect_resolution}
        onChange={handleDetectResolutionChanged}
        handleReset={handleDetectResolutionReset}
        withReset
        min={0}
        max={4096}
        withInput
      />
      <IAISlider
        label="Image Resolution"
        value={image_resolution}
        onChange={handleImageResolutionChanged}
        handleReset={handleImageResolutionReset}
        withReset
        min={0}
        max={4096}
        withInput
      />
      <IAISwitch
        label="Scribble"
        isChecked={scribble}
        onChange={handleScribbleChanged}
      />
      <IAISwitch label="Safe" isChecked={safe} onChange={handleSafeChanged} />
    </Flex>
  );
};

export default memo(PidiProcessor);
