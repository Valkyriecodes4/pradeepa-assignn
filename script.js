document.addEventListener('DOMContentLoaded', function () {
  const quizContainer = document.getElementById('quiz-container');
  const questionContainer = document.getElementById('question-container');
  const optionsContainer = document.getElementById('options-container');
  const submitButton = document.getElementById('submit-btn');
  const resultContainer = document.getElementById('result-container');

  let currentQuestionIndex = 0;
  let score = 0;

  // Load questions from XML
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          const xmlDoc = this.responseXML;
          const questions = xmlDoc.getElementsByTagName('question');
          loadQuestion(questions[currentQuestionIndex]);
      }
  };
  xhttp.open('GET', 'questions.xml', true);
  xhttp.send();

  function loadQuestion(question) {
      const questionText = question.querySelector('text').textContent;
      const options = Array.from(question.querySelectorAll('option')).map(option => option.textContent);

      questionContainer.textContent = questionText;

      optionsContainer.innerHTML = '';
      options.forEach((option, index) => {
          const optionElement = document.createElement('div');
          optionElement.textContent = option;
          optionElement.classList.add('option');
          optionElement.addEventListener('click', () => selectOption(index));
          optionsContainer.appendChild(optionElement);
      });

      submitButton.disabled = true;
  }

  function selectOption(selectedIndex) {
      const options = Array.from(optionsContainer.children);
      options.forEach((option, index) => {
          option.classList.toggle('selected', index === selectedIndex);
      });

      submitButton.disabled = false;
  }

  submitButton.addEventListener('click', () => {
      const selectedOption = optionsContainer.querySelector('.selected');
      if (!selectedOption) return;

      const selectedOptionIndex = Array.from(optionsContainer.children).indexOf(selectedOption);

      const correctAnswer = questions[currentQuestionIndex].querySelector('correct').textContent;
      const userAnswer = questions[currentQuestionIndex].querySelectorAll('option')[selectedOptionIndex].textContent;

      if (userAnswer === correctAnswer) {
          score++;
      }

      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
          loadQuestion(questions[currentQuestionIndex]);
      } else {
          showResult();
      }
  });

  function showResult() {
      quizContainer.innerHTML = '';
      resultContainer.textContent = `Your Score: ${score} / ${questions.length}`;
      resultContainer.classList.add('result');
  }
});