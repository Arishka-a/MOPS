interface Props {
  testStage: string | null | undefined;
  isInstalling: boolean;
  installJustFinished: boolean;
  wasInstalled: boolean;
}

type BadgeVariant = 'installing' | 'installed' | 'needs_install';

const VARIANTS: Record<BadgeVariant, { label: string; className: string }> = {
  installing: {
    label: 'устанавливается',
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

const ImageStatusBadge = ({ testStage, isInstalling, installJustFinished, wasInstalled }: Props) => {
  const isBackendInstalling = testStage === 'installing_image' || testStage === 'reloading';

  let variant: BadgeVariant;
  if (isInstalling || isBackendInstalling) {
    variant = 'installing';
  } else if (installJustFinished || wasInstalled) {
    variant = 'installed';
  } else {
    variant = 'needs_install';
  }

  const { label, className } = VARIANTS[variant];

  return (
    <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
};

export default ImageStatusBadge;
