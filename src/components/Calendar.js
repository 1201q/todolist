import Calendar from "react-calendar";
import React, { useState, useEffect } from "react";
import styles from "components/styles/CalendarStyle.css";
import moment from "moment";

const CalendarComponents = () => {
  const today = {
    year: new Date().getFullYear(), //오늘 연도
    month: new Date().getMonth() + 1, //오늘 월
    date: new Date().getDate(), //오늘 날짜
    day: new Date().getDay(), //오늘 요일
  };

  const [month, setMonth] = useState(today.month);
  const [day, setDay] = useState(today.day);
  const [date, setDate] = useState(today.date);
  const [year, setYear] = useState(today.year);

  const monthFinalDate = {
    current: new Date(year, month, 0).getDate(),
    temp: new Date(year, month, 0).getDate(),
  };

  let initArray = [];
  let makeArray = [];
  let start = 0;
  useEffect(() => {
    initArray = [];
    calendarMake();
  }, [month]);

  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const todayDay = new Date(year, month - 1, date).getDay();

  const preMonth = () => {
    monthfinalDateControl("PREV");
    if (month !== 1) {
      if (date > monthFinalDate.temp) {
        setMonth(month - 1);
        setDate(monthFinalDate.temp);
      } else {
        setMonth(month - 1);
      }
    } else if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    }
  };
  const nextMonth = () => {
    monthfinalDateControl("NEXT");
    if (month !== 12) {
      if (date > monthFinalDate.temp) {
        setMonth(month + 1);
        setDate(monthFinalDate.temp);
      } else {
        setMonth(month + 1);
      }
    } else if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    }
  };
  const preDate = () => {
    monthfinalDateControl("PREV");
    if (date !== 1) {
      setDate(date - 1);
    } else {
      preMonth();
      setDate(monthFinalDate.temp);
    }
  };
  const nextDate = () => {
    monthfinalDateControl("NEXT");
    if (date !== monthFinalDate.current) {
      setDate(date + 1);
    } else {
      nextMonth();
      setDate(1);
    }
  };

  const currentDateClg = () => {
    console.log(year, month, date);
    console.log(new Date(year, month - 1, date));
  };
  const monthfinalDateControl = (mode) => {
    if (mode === "PREV") {
      if (month !== 1) {
        monthFinalDate.temp = new Date(year, month - 1, 0).getDate();
      }
    } else if (mode === "NEXT") {
      if (month !== 12) {
        monthFinalDate.temp = new Date(year, month + 1, 0).getDate();
      }
    }
  };

  const calendarMake = () => {
    const fisrtDate = new Date(year, month - 1, 1).getDay();
    let ii = 0;
    let finaldateCal = 0;
    for (let i = 0; i < 7; i++) {
      if (fisrtDate > i) {
        initArray.push(0);
      } else {
        ii++;
        initArray.push(ii);
      }
    }
    for (let j = ii + 1; j <= monthFinalDate.current; j++) {
      initArray.push(j);
    }

    for (let i = 0; i < 6; i++) {
      makeArray.push(<div key={(i + 1) * 100}></div>);
      for (let j = start; j < 7 + start; j++) {
        if (i === 0) {
          if (initArray[j] === 0) {
            finaldateCal++;
          }
        }

        // 마지막날 다음 버튼들은 push하지 않게
        if (finaldateCal + monthFinalDate.current > j) {
          makeArray.push(
            <span id={j} key={j}>
              {
                initArray[j] !== 0 ? (
                  <button className="Calendarbtn" key={j}>
                    {initArray[j]}{" "}
                  </button>
                ) : (
                  <button
                    className="Calendartrashbtn"
                    key={j}
                    style={{ border: "none" }}
                  >
                    &nbsp;
                  </button>
                )
                // <button style={{ border: "none", color: "white" }}>0</button>
              }
            </span>
          );
        }

        ///
      }
      start += 7;
    }

    return makeArray;
  };

  return (
    <div>
      <h2>
        {year}년 {month}월 {date}일 {days[todayDay]}({todayDay})
      </h2>
      <button onClick={preMonth}>전달</button>
      <button onClick={nextMonth}>다음달</button>
      <button onClick={preDate}>전날</button>
      <button onClick={nextDate}>다음날</button>
      <button onClick={currentDateClg}>출력해볼까?</button>
      <div className="Calendar">{calendarMake()}</div>
    </div>
  );
};

export default CalendarComponents;
