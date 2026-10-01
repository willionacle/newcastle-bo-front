import React, { useMemo } from 'react';
import { GF } from '@/utils/GlobalFunctions';

interface UserGradeDisplayProps {
  grade: any; 
  lastDepositDate: string | number | Date;
  userGradeDay: number | null;
  localGradeConfig: any;
}

const UserGradeDisplay: React.FC<UserGradeDisplayProps> = ({ 
  grade, 
  lastDepositDate, 
  userGradeDay, 
  localGradeConfig 
}) => {
  const gradeDisplay = useMemo(() => {
    const isRecentDeposit = lastDepositDate
      ? (Date.now() - new Date(lastDepositDate).getTime()) / (1000 * 60 * 60 * 24) <= 30
      : false;

    return GF.getGradeDisplay({
      userGrade: grade ?? null,
      userGradeDay: userGradeDay ?? null,
      localGradeConfig: localGradeConfig,
      isRecentDeposit,
    });
  }, [grade, lastDepositDate, userGradeDay, localGradeConfig]);

  return <>{gradeDisplay}</>;
};

export default UserGradeDisplay;