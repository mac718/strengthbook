import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Grid,
  Box,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import ExerciseEntry from '../components/ExerciseEntry';
import styled from 'styled-components';

interface NewWorkoutFormProps {
  date: Date;
}

const ExerciseMenu = styled(Box)`
  height: 50vh;
  border: 1px solid lightGrey;
  margin-top: 50px;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
`;

const MenuItemDiv = styled(ListItem)`
  &:hover {
    background-color: #eeb868;
  }
`;

const NewWorkoutForm = ({ date }: NewWorkoutFormProps) => {
  const [exercises, setExercises] = useState(['Hello']);
  const [sets, setSets] = useState({});
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  //const [menuItemHighlight, setItemMenuHighlight] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addExercise = e => {
    e.preventDefault();
    const exercise = e.target.innerText;
    setExercises([...exercises, exercise]);
    console.log(e.target.innerText);
    handleClose();
  };

  const addSet = e => {
    e.preventDefault();
    const setNumber = Object.keys(sets).length + 1;
    setSets({ ...sets, setNumber: { weight: 0, reps: 0, RPE: 0 } });
  };

  const exerciseDivs = exercises.map(exercise => {
    return <ExerciseEntry exercise={exercise} />;
  });

  let exerciseList = [
    'Low Bar Squat with Belt',
    'High Bar Squat with Belt',
    '2-count Paused Low Bar Squat with Belt',
    'Competition Bench',
    '2-count Paused Bench',
    'Conventional Deadlift with Belt',
    'Sumo Deadlift with Belt',
  ];

  const exerciseMenuItems = exerciseList.map(exercise => {
    return (
      <MenuItemDiv>
        <Typography>{exercise}</Typography>
      </MenuItemDiv>
    );
  });

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
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {exerciseDivs}
        </Grid>
        <Grid item xs={4}>
          <ExerciseMenu>
            <List>{exerciseMenuItems}</List>
          </ExerciseMenu>
        </Grid>
      </Grid>
    </>
  );
};

export default NewWorkoutForm;
