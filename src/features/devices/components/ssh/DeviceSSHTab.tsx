import { useState } from 'react';
import { useSSHQueue } from '../../hooks/useSSHQueue';
import type { SSHCommandParams } from '../../hooks/useSSHQueue';
import SSHCommandForm from './SSHCommandForm';
import SSHConsole from './SSHConsole';
import SSHTaskManager from './SSHTaskManager';

interface Props {
  hostname: string;
}

const DEFAULT_PARAMS: SSHCommandParams = {
  retries: 3,
  retry_delay: 5,
  cmd_timeout: 5,
  port: 22,
};

const DeviceSSHTab = ({ hostname }: Props) => {
  const [params, setParams] = useState<SSHCommandParams>(DEFAULT_PARAMS);
  const [command, setCommand] = useState('');
  const [managerTaskId, setManagerTaskId] = useState('');
  const { history, isExecuting, execute } = useSSHQueue(hostname);

  const handleParamsChange = (patch: Partial<SSHCommandParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async () => {
    if (!command.trim() || isExecuting) return;
    const toRun = command;
    setCommand('');
    await execute(toRun, params);
  };

  return (
    <div>
      <div className="flex gap-5 items-stretch">
        <SSHCommandForm
          params={params}
          onChange={handleParamsChange}
          onExecute={handleSubmit}
          isExecuting={isExecuting}
          canExecute={command.trim().length > 0}
        />
        <SSHConsole
          hostname={hostname}
          history={history}
          command={command}
          onCommandChange={setCommand}
          onSubmit={handleSubmit}
          isExecuting={isExecuting}
          onPickTaskId={setManagerTaskId}
        />
      </div>

      <SSHTaskManager
        taskId={managerTaskId}
        onTaskIdChange={setManagerTaskId}
      />
    </div>
  );
};

export default DeviceSSHTab;
