import { useEffect, useState } from 'react';
import type { ImageSchema } from '../../types';
import { DeviceTestStage } from '../../../../types/enums';
import { isPendingInstall } from '../../hooks/imageBindingPersist';

interface Props {
  hostname: string;
  image: ImageSchema | null | undefined;
  testStage?: string | null | undefined;
  isInstalling?: boolean;
}

type Variant = 'installing' | 'installed' | 'needs_install';

const VARIANTS: Record<Variant, { label: string; className: string }> = {
  installing: {
    label: 'установка образа',
    className: 'bg-[#DBEAFE] text-[#2563EB]',
  },
  installed: {
    label: 'установлен',
    className: 'bg-[#DCFCE7] text-[#16A34A]',
  },
  needs_install: {
    label: 'требует установки',
    className: 'bg-[#FEF3C7] text-[#B45309]',
  },
};

const ImageStatusBadge = ({ hostname, image, testStage, isInstalling }: Props) => {
  const [pendingTick, setPendingTick] = useState(0);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('image_pending_install:')) {
        setPendingTick((n) => n + 1);
      }
    };
    const onFocus = () => setPendingTick((n) => n + 1);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);
  void pendingTick;
  const pending = isPendingInstall(hostname, image?.id);

  const isBackendInstalling =
    testStage === DeviceTestStage.INSTALLING_IMAGE ||
    testStage === DeviceTestStage.RELOADING;

  let variant: Variant;
  if (isInstalling || isBackendInstalling) {
    variant = 'installing';
  } else if (image == null) {
    variant = 'needs_install';
  } else if (pending) {
    variant = 'needs_install';
  } else {
    variant = 'installed';
  }

  const { label, className } = VARIANTS[variant];

  return (
    <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
};

export default ImageStatusBadge;
