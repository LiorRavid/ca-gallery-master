'use strict'
var isPlay = false

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
    } 

function shuffle(items) {
    var randIdx, keep, i
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1)
        keep = items[i]
        items[i] = items[randIdx]
        items[randIdx] = keep
    }
}

function fillNums(nums){
    for(var i=0;i<16;i++){
        nums.push(i+1)
    }
}


// function startTimer(rt) {
//     if (!isPlay) return
//     setTimeout(function () {
//         realTime = Date.now() - rt
//         document.querySelector('h3 span1').innerText = presentTime(realTime)
//         console.log(presentTime(realTime))
//         startTimer(rt)
//     })
// }

// function presentTime(time) {
//     var msec = parseInt(time)
//     var sec = parseInt(time / 1000)
//     var min = parseInt(time / 60000)
//     if (sec < 10) sec = '0' + sec
//     if (min < 10) min = '0' + min
//     if (msec > 1000) msec = msec % 1000
//     if (sec > 59) {
//         sec = sec % 60
//         if (sec < 10) sec = '0' + sec
//     }
//     return min + ':' + sec + '.' + msec
// }