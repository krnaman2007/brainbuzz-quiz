document.addEventListener('DOMContentLoaded',()=>{

    const startBtn = document.getElementById("start-btn")
    const nextBtn = document.getElementById("next-btn")
    const finishBtn = document.getElementById('finish-btn')
    const restartBtn = document.getElementById("restart-btn")
    const questionContainer = document.getElementById("question-container")
    const questionText = document.getElementById("question-text")
    const questionScore = document.getElementById('question-score')
    const choicesList = document.getElementById("choices-list")
    const timer=document.getElementById('timer')
    const resultContainer = document.getElementById("result-container")
    const scoreDisplay = document.getElementById("score")
    const quesProgress= document.getElementById('question-progress-bar')
    const category=document.getElementById('category-options')
    const startConfirmMessage=document.getElementById('start-confirm')
    const quesNumber=document.getElementById('question-no')
    const performanceMessage=document.getElementById('performance-message')
    const reviewContainer = document.getElementById('review-container')
    const reviewButton=document.getElementById('review-btn')
    const backButton=document.getElementById('back')
    const scoreHeading=document.getElementById('score-heading')

    const allQuestions = [
      // ===== EASY =====
      {
        question: "Which planet is closest to the Sun?",
        choices: ["Venus", "Earth", "Mercury", "Mars"],
        answer: "Mercury",
        score: 2
      },
      {
        question: "How many planets are in our Solar System?",
        choices: ["7", "8", "9", "10"],
        answer: "8",
        score: 2
      },
      {
        question: "What is the name of Earth's natural satellite?",
        choices: ["Titan", "Moon", "Phobos", "Europa"],
        answer: "Moon",
        score: 2
      },
      {
        question: "Which is the largest planet in our Solar System?",
        choices: ["Saturn", "Neptune", "Jupiter", "Uranus"],
        answer: "Jupiter",
        score: 2
      },
      {
        question: "What do we call a group of stars forming a pattern?",
        choices: ["Galaxy", "Nebula", "Constellation", "Cluster"],
        answer: "Constellation",
        score: 2
      },

      // ===== MEDIUM =====
      {
        question: "What is the name of the galaxy we live in?",
        choices: ["Andromeda", "Milky Way", "Triangulum", "Whirlpool"],
        answer: "Milky Way",
        score: 5
      },
      {
        question: "Which planet has the most moons?",
        choices: ["Jupiter", "Uranus", "Neptune", "Saturn"],
        answer: "Saturn",
        score: 5
      },
      {
        question: "What is the speed of light approximately?",
        choices: ["1 lakh km/s", "2 lakh km/s", "3 lakh km/s", "4 lakh km/s"],
        answer: "3 lakh km/s",
        score: 5
      },
      {
        question: "Which space telescope was launched in 1990?",
        choices: ["James Webb", "Hubble", "Chandra", "Spitzer"],
        answer: "Hubble",
        score: 5
      },
      {
        question: "What is a light year?",
        choices: ["Time light takes to reach Moon", "Distance light travels in one year", "Speed of light per hour", "Age of a star"],
        answer: "Distance light travels in one year",
        score: 5
      },

      // ===== HARD =====
      {
        question: "What is the Chandrasekhar limit?",
        choices: ["Max size of a black hole", "Min mass for a neutron star", "Max mass of a white dwarf", "Min size of a nebula"],
        answer: "Max mass of a white dwarf",
        score: 10
      },
      {
        question: "Which phenomenon causes time to slow near a black hole?",
        choices: ["Quantum tunneling", "Gravitational time dilation", "Redshift", "Dark energy"],
        answer: "Gravitational time dilation",
        score: 10
      },
      {
        question: "What is the name of the first black hole ever photographed?",
        choices: ["Sagittarius A*", "Cygnus X-1", "M87*", "V616 Mon"],
        answer: "M87*",
        score: 10
      },
      {
        question: "What type of star will our Sun eventually become?",
        choices: ["Neutron Star", "Black Hole", "Red Giant then White Dwarf", "Supernova"],
        answer: "Red Giant then White Dwarf",
        score: 10
      },
      {
        question: "What is the Cosmic Microwave Background (CMB)?",
        choices: ["Radiation from black holes", "Leftover radiation from the Big Bang", "Light from distant galaxies", "Solar wind particles"],
        answer: "Leftover radiation from the Big Bang",
        score: 10
      }
  ]
  let questions=[]
  let userAnswers=[]
  startBtn.classList.add('hidden')
  const categ = category.querySelectorAll("li")
  categ.forEach(type=>{
    type.addEventListener('click',(e)=>{
      if(e.target.textContent==="😄 Easy") questions=allQuestions.slice(0,5)
      if(e.target.textContent==="😐 Medium") questions=allQuestions.slice(5,10)
      if(e.target.textContent==="😵 Hard") questions=allQuestions.slice(10,15)
      
      category.classList.add('hidden')
      startConfirmMessage.classList.remove('hidden')
      startConfirmMessage.textContent=`You have selected the category ${e.target.textContent}`
      startBtn.classList.remove('hidden')
    })
  })
  let currentQuestionIndex=0
  let score=0
  

  startBtn.addEventListener('click',startQuiz)

  nextBtn.addEventListener('click',()=>{
    currentQuestionIndex++
    showQuestion()
  })
  finishBtn.addEventListener('click',()=>{
    showResult()
  })

  restartBtn.addEventListener('click',()=>{
    stopTimer()
    currentQuestionIndex=0
    score=0
    userAnswers=[]
    reviewContainer.innerHTML=""
    resultContainer.classList.add('hidden')
    questionContainer.classList.add('hidden')
    category.classList.remove('hidden')
    reviewButton.classList.remove('hidden')
    scoreHeading.classList.remove('hidden')
    scoreDisplay.classList.remove('hidden')
    performanceMessage.classList.remove('hidden')
    startConfirmMessage.classList.add('hidden')
    startBtn.classList.add('hidden')   
    startTime=null
  })

  reviewButton.addEventListener('click',()=>{
    reviewContainer.innerHTML = ""
    showPerformanceReport()
    reviewButton.classList.add('hidden')
    scoreHeading.classList.add('hidden')
    scoreDisplay.classList.add('hidden')
    performanceMessage.classList.add('hidden')
    reviewContainer.classList.remove('hidden')
    restartBtn.classList.add('hidden')
    backButton.classList.remove('hidden')
    
  })

  backButton.addEventListener('click',()=>{
    reviewContainer.classList.add('hidden')
    backButton.classList.add('hidden')
    restartBtn.classList.remove('hidden')
    reviewButton.classList.remove('hidden')
    scoreHeading.classList.remove('hidden')
    scoreDisplay.classList.remove('hidden') 
    performanceMessage.classList.remove('hidden')
  })

  let startTime=null
  let timeLeft=15
  let timeInterval

  function startTimer(currentQuestionIndex,choicesList){
    timeLeft=15
    updateTimerDisplay()

    timeInterval=setInterval(()=>{
        timeLeft--;
        updateTimerDisplay()
        if(timeLeft<=5) timer.classList.add('danger')
        else timer.classList.remove('danger')
        if(timeLeft===0){
          userAnswers.push(null)
          clearInterval(timeInterval)
          const correctAnswer=questions[currentQuestionIndex].answer
          const choices = choicesList.querySelectorAll("li")
          choices.forEach(choice => {
            if(choice.textContent.trim()===correctAnswer){
              choice.style.backgroundColor="#43a047"
              choice.style.color="#ffffff"
            }
          })
          if(currentQuestionIndex === questions.length - 1){
              finishBtn.classList.remove('hidden')
          }
          else{
            nextBtn.classList.remove('hidden')
          }
        }
    },1000)
  }
  function stopTimer() {
    clearInterval(timeInterval);
  }
  function updateTimerDisplay(){
    timer.textContent="⏱️"+timeLeft+"s"
  }

  function startQuiz(){
    startTime=Date.now() 
    questions=questions.sort(()=>Math.random()-0.5)
    startConfirmMessage.classList.add('hidden')
    startBtn.classList.add('hidden')
    finishBtn.classList.add('hidden')
    resultContainer.classList.add('hidden')
    questionContainer.classList.remove('hidden')
    showQuestion()
  }

  function showQuestion(){
    nextBtn.classList.add('hidden')
    quesProgress.classList.remove('hidden')
    quesProgress.value=((currentQuestionIndex+1)/questions.length)*100
    questionText.textContent=questions[currentQuestionIndex].question
    quesNumber.textContent=`Question ${currentQuestionIndex+1}/${questions.length}`
    questionScore.textContent=`🎯Marks: ${questions[currentQuestionIndex].score}`
    choicesList.innerHTML="" //clear previous choices
    let answered=false

    questions[currentQuestionIndex].choices.forEach(choice => {
        const li=document.createElement('li')
        li.textContent=choice
        
        li.addEventListener('click',()=>{
          if(answered) return
          answered=true
          stopTimer()
          selectAnswer(choice,li)
        })
        choicesList.appendChild(li)
    })
    startTimer(currentQuestionIndex,choicesList)
  }

  function selectAnswer(choice,li){
    userAnswers.push(choice)
    const correctAnswer=questions[currentQuestionIndex].answer
    if(choice===correctAnswer){
        score+=questions[currentQuestionIndex].score
        li.style.backgroundColor = "#43a047"
        li.style.color = "#ffffff"
    }
    else{
        const allChoices = choicesList.querySelectorAll("li")
        allChoices.forEach(c => {
          if(c.textContent.trim() === correctAnswer){
            c.style.backgroundColor = "#43a047"
            c.style.color = "#ffffff"
          }
        })
        li.style.backgroundColor = "#e53935"
        li.style.color = "#ffffff"
    }
    
    if(currentQuestionIndex === questions.length - 1){
        nextBtn.classList.add('hidden')
        finishBtn.classList.remove('hidden')
    } else {
        nextBtn.classList.remove('hidden')
        finishBtn.classList.add('hidden')
    }
  }
  function showPerformanceReport(){
    questions.forEach((question, index) => {
        const div=document.createElement('div')
        const isCorrect=userAnswers[index]===question.answer
        const isSkipped=userAnswers[index]===null
        div.innerHTML=`
          <p><b>Q${index+1}:</b> ${question.question}</p>
          <p>Correct Answer: ${question.answer}</p>
          <p>Your Answer: ${isSkipped ? "⏰ Time Out" : userAnswers[index]}</p>
          <p>${isCorrect ? "✅ Correct" : "❌ Wrong"}</p>
        `
        reviewContainer.appendChild(div)
    })
  }
  function showResult(){
    const endTime=Date.now()
    const totalSeconds=Math.floor((endTime - startTime) / 1000)
    const minutes=Math.floor(totalSeconds / 60)
    const seconds=totalSeconds % 60
    const timeDisplay=minutes>0 ? `${minutes}m ${seconds}s`:`${seconds}s`

    questionContainer.classList.add('hidden')
    resultContainer.classList.remove('hidden')
    quesProgress.classList.add('hidden')
    reviewContainer.classList.add('hidden')
    backButton.classList.add('hidden')

    let totalScore=0
    questions.forEach(question => totalScore+=question.score)
    scoreDisplay.textContent=`🏆 ${score} / ${totalScore}`
    document.getElementById('total-time').textContent=`⏱️ Time taken: ${timeDisplay}`
    let perfMsg=""
    let percentage=(score/totalScore)*100
    if(percentage===100){
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      setTimeout(() => {
          confetti({ particleCount: 100, spread: 70, origin: { x: 0.2, y: 0.6 } })
      }, 500)
      setTimeout(() => {
          confetti({ particleCount: 100, spread: 70, origin: { x: 0.8, y: 0.6 } })
      }, 1000)
    }
    if(percentage>=90) perfMsg="🎉 Excellent!"
    else if(percentage>=50) perfMsg="👏 Good Try!"
    else perfMsg="💪 Better Luck Next Time!"
    performanceMessage.textContent=`${perfMsg}`
    showPerformanceReport()
  }

})