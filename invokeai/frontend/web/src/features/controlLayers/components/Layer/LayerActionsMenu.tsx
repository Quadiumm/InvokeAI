import { Menu, MenuItem, MenuList } from '@invoke-ai/ui-library';
import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { CanvasEntityMenuButton } from 'features/controlLayers/components/common/CanvasEntityMenuButton';
import {
  layerDeleted,
  layerMovedBackwardOne,
  layerMovedForwardOne,
  layerMovedToBack,
  layerMovedToFront,
  selectCanvasV2Slice,
} from 'features/controlLayers/store/canvasV2Slice';
import { selectLayerOrThrow } from 'features/controlLayers/store/layersReducers';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PiArrowDownBold,
  PiArrowLineDownBold,
  PiArrowLineUpBold,
  PiArrowUpBold,
  PiTrashSimpleBold,
} from 'react-icons/pi';

type Props = {
  id: string;
};

export const LayerActionsMenu = memo(({ id }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectValidActions = useMemo(
    () =>
      createMemoizedSelector(selectCanvasV2Slice, (canvasV2) => {
        const layer = selectLayerOrThrow(canvasV2, id);
        const layerIndex = canvasV2.layers.entities.indexOf(layer);
        const layerCount = canvasV2.layers.entities.length;
        return {
          canMoveForward: layerIndex < layerCount - 1,
          canMoveBackward: layerIndex > 0,
          canMoveToFront: layerIndex < layerCount - 1,
          canMoveToBack: layerIndex > 0,
        };
      }),
    [id]
  );
  const validActions = useAppSelector(selectValidActions);
  const onDelete = useCallback(() => {
    dispatch(layerDeleted({ id }));
  }, [dispatch, id]);
  const moveForwardOne = useCallback(() => {
    dispatch(layerMovedForwardOne({ id }));
  }, [dispatch, id]);
  const moveToFront = useCallback(() => {
    dispatch(layerMovedToFront({ id }));
  }, [dispatch, id]);
  const moveBackwardOne = useCallback(() => {
    dispatch(layerMovedBackwardOne({ id }));
  }, [dispatch, id]);
  const moveToBack = useCallback(() => {
    dispatch(layerMovedToBack({ id }));
  }, [dispatch, id]);

  return (
    <Menu>
      <CanvasEntityMenuButton />
      <MenuList>
        <MenuItem onClick={moveToFront} isDisabled={!validActions.canMoveToFront} icon={<PiArrowLineUpBold />}>
          {t('controlLayers.moveToFront')}
        </MenuItem>
        <MenuItem onClick={moveForwardOne} isDisabled={!validActions.canMoveForward} icon={<PiArrowUpBold />}>
          {t('controlLayers.moveForward')}
        </MenuItem>
        <MenuItem onClick={moveBackwardOne} isDisabled={!validActions.canMoveBackward} icon={<PiArrowDownBold />}>
          {t('controlLayers.moveBackward')}
        </MenuItem>
        <MenuItem onClick={moveToBack} isDisabled={!validActions.canMoveToBack} icon={<PiArrowLineDownBold />}>
          {t('controlLayers.moveToBack')}
        </MenuItem>
        <MenuItem onClick={onDelete} icon={<PiTrashSimpleBold />} color="error.300">
          {t('common.delete')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
});

LayerActionsMenu.displayName = 'LayerActionsMenu';