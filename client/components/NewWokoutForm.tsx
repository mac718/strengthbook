import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';

interface NewWorkoutFormProps {
  date: Date;
}

const NewWorkoutForm = ({ date }: NewWorkoutFormProps) => {
  const [exercises, setExercises] = useState([]);
  const [sets, setSets] = useState({});
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addExercise = e => {
    e.preventDefault();
    const exercise = e.target.firstChild.innerText;
    setExercises([...exercises, exercise]);
    console.log(e.target.innerText);
    handleClose();
  };

  const addSet = e => {
    e.preventDefault();
    const setNumber = Object.keys(sets).length + 1;
    setSets({ ...sets, setNumber: { weight: 0, reps: 0, RPE: 0 } });
  };

  return (
    <>
      <form>
        <div>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Exercise Menu
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={e => addExercise(e)}>
              Low Bar Squat w/belt
            </MenuItem>
            <MenuItem onClick={e => addExercise(e)}>Competition Bench</MenuItem>
            <MenuItem onClick={e => addExercise(e)}>Deadlift</MenuItem>
          </Menu>
        </div>
      </form>
    </>
  );
};

export default NewWorkoutForm;
