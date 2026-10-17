import React from 'react';
import type { Scenario } from '../../types/game';
import { DoodleCanvas } from '../DoodleCanvas';

interface DrawScreenProps {
  scenario: Scenario;
  onSubmitDoodle: (dataUrl: string) => void;
}

export const DrawScreen: React.FC<DrawScreenProps> = ({
  scenario,
  onSubmitDoodle,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 w-full animate-fade-in">
      <DoodleCanvas
        scenario={scenario}
        onFinishDoodle={onSubmitDoodle}
      />
    </div>
  );
};
