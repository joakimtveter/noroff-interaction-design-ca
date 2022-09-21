function countdownTimer() {
    const daysElement = document.querySelector('.timer.days');
    const hoursElement = document.querySelector('.timer.hrs');
    const minutesElement = document.querySelector('.timer.min');
    const secondsElement = document.querySelector('.timer.sec');
    const target = new Date('2021-11-22T07:00:00').getTime();
    const now = new Date().getTime();
    const remaining = target - now;
  
    let days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    let hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    daysElement.innerHTML = (days >= 10) ? days : `0${days}`;
    hoursElement.innerHTML = (hours >= 10) ? hours : `0${hours}`;
    minutesElement.innerHTML = (minutes >= 10) ? minutes : `0${minutes}`;
    secondsElement.innerHTML = (seconds >= 10) ? seconds : `0${seconds}`;
}

setInterval(countdownTimer, 1000);

