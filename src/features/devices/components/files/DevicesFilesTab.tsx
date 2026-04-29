import SendFileForm from './SendFileForm';

interface Props {
  hostname: string;
}

const DeviceFilesTab = ({ hostname }: Props) => {
  return (
    <div className="flex justify-center">
      <SendFileForm hostname={hostname} />
    </div>
  );
};

export default DeviceFilesTab;
