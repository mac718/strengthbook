import React, { useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import NewWokoutDialog from '../NewWorkoutDialog';

const StyledTh = styled.th`
  background-color: #456990;
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
  border: 1px solid #333;
  height: 8em;
`;

const TodayTd = styled(StyledTd)`
  background-color: #ef767a;
`;

const DateDiv = styled.div`
  float: right;
  height: 100%;
`;

const MonthHeading = styled.div`
  background-color: #49dcb1;
  height: 50px;
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

const Calender: React.FC = () => {
  const currentDate = moment();
  const [dateObject, setDateObject] = useState(currentDate);
  const weekdayShort = moment.weekdaysShort();

  console.log(dateObject);
  console.log(dateObject.daysInMonth());

  const daysOfWeek = weekdayShort.map(day => {
    return <StyledTh key={day}>{day}</StyledTh>;
  });

  function firstDayOfMonth() {
    let firstDay = moment(dateObject)
      .startOf('month')
      .format('d');
    return firstDay;
  }

  console.log('firstday', firstDayOfMonth());

  let daysInMonth = dateObject.daysInMonth();

  let blanks = [];

  for (let i = 0; i < parseInt(firstDayOfMonth()); i++) {
    blanks.push(
      <BlankTd key={i} className="calendar-day empty">
        {''}
      </BlankTd>,
    );
  }

  let daysInMonthArr = [];

  for (let d = 1; d <= daysInMonth; d++) {
    if (d === moment().date()) {
      daysInMonthArr.push(
        <TodayTd key={d} className="calendar-day">
          <NewWokoutDialog date={new Date()} />
          <DateDiv>{d}</DateDiv>
        </TodayTd>,
      );
    } else {
      daysInMonthArr.push(
        <StyledTd key={d} className="calendar-day">
          <NewWokoutDialog date={new Date()} />
          <DateDiv>{d}</DateDiv>
        </StyledTd>,
      );
    }
  }

  let totalSlots = [...blanks, ...daysInMonthArr];
  let rows = [];
  let cells = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row); // if index not equal 7 that means not go to next week
    } else {
      rows.push(cells); // when reach next week we contain all td in last week to rows
      cells = []; // empty container
      cells.push(row); // in current loop we still push current row to new container
    }
    if (i === totalSlots.length - 1) {
      // when end loop we add remain date
      rows.push(cells);
    }
  });

  let daysinmonth = rows.map((d, i) => {
    return <tr>{d}</tr>;
  });

  let month = () => {
    return dateObject.format('MMMM');
  };

  let year = () => {
    return dateObject.format('YYYY');
  };

  function handlePrevisousMonthClick() {
    let date = dateObject;
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
