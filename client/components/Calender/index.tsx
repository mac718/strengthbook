import React, { useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import Link from 'next/link';
import NewWokoutDialog from '../NewWorkoutDialog';

const StyledTh = styled.th`
  background-color: #fdf6ed;
  width: 10%;
`;

const StyledTable = styled.table`
  width: 85%;
  border: 1px solid #333;
  height: 85vh;
  margin: auto;
`;

const BlankTd = styled.td`
  border: 1px solid #333;
  height: 8em;
  background-color: lightGrey;
`;

const StyledTd = styled.td`
  border: 1px solid #666;
  height: 8em;
`;

const TodayTd = styled(StyledTd)`
  background-color: #ef767a;
`;

const DateDiv = styled.div`
  float: right;
  height: 100%;
  width: 100%;
`;

const MonthHeading = styled.div`
  background-color: #648db9;
  height: 60px;
  width: 85%;
  text-align: center;
  margin: auto;
`;

const PreviousMonthArrow = styled.span`
  float: left;
`;

const NextMonthArrow = styled.span`
  float: right;
`;

const CalenderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CalDiv = styled.div`
  width: 100%;
`;

const CalCellDay = styled(Typography)`
  float: right;
`;

const WorkoutBanner = styled.div`
  width: 95%;
  height: 17%;
  background-color: #49beaa;
  text-align: center;
  margin-bottom: 3px;
  border-radius: 3px;
  box-shadow: 1px 1px 2px 2px #bbb;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
`;

const WorkoutBannerLink = styled.a`
  text-decoration: none;
`;

const Calender = ({ user }) => {
  const currentDate = moment();
  const [dateObject, setDateObject] = useState(currentDate);
  const weekdayShort = moment.weekdaysShort();

  console.log(dateObject);
  console.log(dateObject.daysInMonth());

  const daysOfWeek = weekdayShort.map(day => {
    return (
      <StyledTh key={day}>
        <Typography>{day}</Typography>
      </StyledTh>
    );
  });

  function firstDayOfMonth() {
    let firstDay = moment(dateObject)
      .startOf('month')
      .format('d');
    return firstDay;
  }

  console.log('firstday', firstDayOfMonth());

  let daysInMonth = dateObject.daysInMonth();

  //blank calender cells
  let blanks = [];

  for (let i = 0; i < parseInt(firstDayOfMonth()); i++) {
    blanks.push(
      <BlankTd key={i} className="calendar-day empty">
        {''}
      </BlankTd>,
    );
  }

  let month = () => {
    return dateObject.format('MMMM');
  };

  let year = () => {
    return dateObject.format('YYYY');
  };

  let daysInMonthArr = [];

  for (let d = 1; d <= daysInMonth; d++) {
    if (d === moment().date()) {
      let tdDate = new Date(`${month()}-${d}-${year()}`);

      //find workouts from the date in question
      let workouts = user.workouts.filter(workout => {
        console.log(tdDate, workout.date);
        return (
          Date.parse(workout.date) === Date.parse(tdDate.toLocaleDateString())
        );
      });
      let workoutButtons = workouts.map(workout => (
        <WorkoutBanner key={workout._id}>
          <Link href="/workout/[id]" as={`workout/${workout._id}`}>
            <a>
              <Typography>Workout</Typography>
            </a>
          </Link>
        </WorkoutBanner>
      ));
      daysInMonthArr.push(
        <TodayTd key={d} className="calendar-day">
          <DateDiv>
            <NewWokoutDialog date={tdDate} />
            <CalCellDay>{d}</CalCellDay>
            {workoutButtons}
          </DateDiv>
        </TodayTd>,
      );
    } else {
      let tdDate = new Date(`${month()}-${d}-${year()}`);

      //find workouts from the date in question
      let workouts = user.workouts.filter(workout => {
        //console.log(tdDate, workout.date);
        return (
          Date.parse(workout.date) === Date.parse(tdDate.toLocaleDateString())
        );
      });
      let workoutButtons = workouts.map(workout => (
        <WorkoutBanner key={workout._id}>
          <Link href="/workout/[id]" as={`/workout/${workout._id}`}>
            <WorkoutBannerLink>
              <Typography>Workout</Typography>
            </WorkoutBannerLink>
          </Link>
        </WorkoutBanner>
      ));
      daysInMonthArr.push(
        <StyledTd key={d} className="calendar-day">
          <DateDiv>
            <NewWokoutDialog date={tdDate} />
            <CalCellDay>{d}</CalCellDay>
            {workoutButtons}
          </DateDiv>
        </StyledTd>,
      );
    }
  }

  let totalSlots = [...blanks, ...daysInMonthArr];
  let rows = [];
  let cells = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (i === totalSlots.length - 1) {
      rows.push(cells);
    }
  });

  let daysinmonth = rows.map((d, i) => {
    return <tr key={d + 1}>{d}</tr>;
  });

  function handlePrevisousMonthClick() {
    setDateObject(moment(dateObject).subtract(1, 'M'));
  }

  function handleNextMonthClick() {
    setDateObject(moment(dateObject).add(1, 'M'));
  }

  return (
    <CalenderContainer>
      <CalDiv>
        <MonthHeading>
          <PreviousMonthArrow onClick={() => handlePrevisousMonthClick()}>
            <i className="fas fa-angle-left"></i>
          </PreviousMonthArrow>
          <NextMonthArrow onClick={() => handleNextMonthClick()}>
            <i className="fas fa-angle-right"></i>
          </NextMonthArrow>
          <Typography variant="h3" color="textSecondary">
            {month()} {year()}
          </Typography>
        </MonthHeading>
        <StyledTable className="calendar-day">
          <thead>
            <tr>{daysOfWeek}</tr>
          </thead>
          <tbody>{daysinmonth}</tbody>
        </StyledTable>
      </CalDiv>
    </CalenderContainer>
  );
};

export default Calender;
