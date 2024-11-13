const video = document.getElementById('interactiveVideo');
const questionOverlay = document.getElementById('questionOverlay');
const questionText = document.getElementById('questionText');

// Define questions and answers
const questions = [
    { 
        time: 5, 
        text: "What is the capital of France?", 
        correctAnswer: "option2", 
        options: ["Berlin", "Paris", "Madrid"] 
    },
];

let questionShown = false; // Track if the question has been shown

// Function to check if it's time to show a question
function checkTime() {
    const currentTime = Math.floor(video.currentTime);
    
    questions.forEach(question => {
        if (currentTime === question.time && !questionShown) {
            showQuestion(question);
            questionShown = true; // Mark the question as shown
        }
    });
}

// Show question overlay
function showQuestion(question) {
    // Set the question text
    questionText.innerText = question.text;

    // Create buttons dynamically based on options
    const buttonsHtml = question.options.map((option, index) => 
        `<button class="answer-button" data-option="option${index + 1}">${option}</button>`
    ).join('');
    
    // Insert buttons into the overlay
    questionOverlay.querySelector('.question-box').innerHTML += buttonsHtml;
    
    questionOverlay.classList.remove('hidden');
    
    // Pause the video
    video.pause();

    // Add event listeners to buttons after they are added to the DOM
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(button => {
        button.addEventListener('click', function() {
            submitAnswer(this.getAttribute('data-option'));
        });
    });
}

// Handle answer submission
function submitAnswer(selectedOption) {
    const currentQuestion = questions.find(q => q.text === questionText.innerText);
    
    let feedbackMessage;
    
    if (selectedOption === currentQuestion.correctAnswer) {
        feedbackMessage = "Correct! The correct answer is " + currentQuestion.options[1] + ".";
    } else {
        feedbackMessage = "Incorrect! The correct answer is " + currentQuestion.options[1] + ".";
    }
    
    // Show feedback message using an alert
    alert(feedbackMessage); 
    
    // Hide the question overlay
    questionOverlay.classList.add('hidden');
    
    // Resume video playback after feedback is acknowledged
    video.play();
}

// Disable skipping by resetting current time if user tries to skip
video.addEventListener('timeupdate', checkTime);
video.addEventListener('seeking', (event) => {
    const currentTime = Math.floor(video.currentTime);
    
    // If seeking past the point where the question appears, reset to last known time
    if (currentTime > questions[0].time && !questionShown) {
        video.currentTime = questions[0].time; // Reset to question time
        alert("You cannot skip past this point until you answer the question.");
    }
});