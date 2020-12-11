const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
let currentQuiz = 0;
let score = 0;
const quizData = [];

const getQuestions = async () => {
  const apiUrl = `https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple`;
  const result = await fetch(apiUrl);
  const jsondata = await result.json();

  jsondata.results.forEach((el) => {
    const answers = {
      a: el.incorrect_answers[0],
      b: el.incorrect_answers[1],
      c: el.incorrect_answers[2],
      d: el.correct_answer,
    };

    quizData.push({
      question: el.question,
      ...answers,

      correct: el.correct_answer,
    });
  });
};

questionEl.classList.add("grayLoad");
answerEls.forEach((answerEl) => {
  answerEl.nextElementSibling.classList.add("grayLoad", "color");
});
getQuestions().then(() => {
  questionEl.classList.remove("grayLoad");
  answerEls.forEach((answerEl) => {
    answerEl.nextElementSibling.classList.remove("grayLoad", "color");
  });
  loadQuiz();
});

function loadQuiz() {
  deselectAnswers();

  const currentQuizData = quizData[currentQuiz];

  questionEl.innerHTML = currentQuizData.question;
  const optionsArray = [
    currentQuizData.a,
    currentQuizData.b,
    currentQuizData.c,
    currentQuizData.d,
  ];

  const elArray = [a_text, b_text, c_text, d_text];

  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * optionsArray.length);

    elArray[i].innerHTML = optionsArray[randomNumber];
    optionsArray.splice(randomNumber, 1);
  }
}

function getSelected() {
  let answer = undefined;

  answerEls.forEach((answerEl) => {
    console.log(answerEl.nextElementSibling.textContent);
    if (answerEl.checked) {
      answer = answerEl.nextElementSibling.textContent;
    }
  });

  return answer;
}

function deselectAnswers() {
  answerEls.forEach((answerEl) => {
    answerEl.checked = false;
  });
}

submitBtn.addEventListener("click", () => {
  // check to see the answer
  const answer = getSelected();

  if (answer) {
    if (answer === quizData[currentQuiz].correct) {
      score++;
    }

    currentQuiz++;
    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      quiz.innerHTML = `
                <h2>You answered correctly at ${score}/${quizData.length} questions.</h2>
                
                <button onclick="location.reload()">Reload</button>
            `;
    }
  }
});
