import React from 'react';
import EditWorkoutForm from '../../../components/EditWorkoutForm';

const EditWorkout = ({ workout, date }) => {
  return <EditWorkoutForm workout={workout} date={date} />;
};

export default EditWorkout;
