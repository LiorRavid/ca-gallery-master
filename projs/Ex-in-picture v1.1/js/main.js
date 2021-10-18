'use strict'

// model:

var gCurrQuestIdx = 0
var gQuests = [
    {id: 1, opts:['Yosi Benayon','Yaniv Katan','Reuven Atar'], correctOptIndex:2 },
    {id: 2, opts:['Eyal Meshomar','Eyal Berkovich','Shlomo Artzi'], correctOptIndex:1 },
    {id: 3, opts:['Yosi Benayon','Yaniv Katan','Ori Sason'], correctOptIndex:0 }
    ]


function initGame() {
    var Quests = createQuests()
    renderQuest(Quests)
}

function createQuests(){
    return gQuests
}

function renderQuest(Quests){
    var strHtml = ''
    var answers = Quests[gCurrQuestIdx].opts
    for (var i = 0; i < answers.length; i++) {
        strHtml += `<button onclick = checkAnswer(${i}) class = "button button${i+1}">${Quests[gCurrQuestIdx].opts[i]}</button>`
        // console.log('strHtml',strHtml); 
    }
    // console.log('strHtml',strHtml)
    var elQuest = document.querySelector("div")
    elQuest.innerHTML += strHtml
    // console.log('elQuest',elQuest)
    renderImg(gCurrQuestIdx+1)
}

function renderImg(questIdx){
   var imgSrc = document.querySelector('.box')
//    console.log(imgSrc)
   imgSrc.innerHTML +=`<img id="${questIdx}" class="questImg" src="img/${questIdx}.jpg">`
}


function checkAnswer(optIdx){
    if(optIdx === gQuests[gCurrQuestIdx].correctOptIndex){
        if(gCurrQuestIdx===2){
            var restart = document.querySelector('.restart')
            restart.style.display = 'block'
            return
        }
        // console.log('optIdx',optIdx)
        gCurrQuestIdx++
        renderQuest(gQuests)
    }
}

function restartGame(){
    var elQuest = document.querySelector(".box")
    elQuest.innerHTML = '<img class="img" src="img/answers.jpg"><button onclick="restartGame()" class="restart">restart</button>'
    var restart = document.querySelector('.restart')
    restart.style.display = 'none'
    gCurrQuestIdx = 0
    initGame()
}











