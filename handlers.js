function generateFromString(ev) {
    makeQuiz(ev.target.range_string.value);
}

function submitQuiz(ev) {
    gradeQuiz(ev.target);
    //ev.target.removeEventListener("submit", submitQuiz);
    return false;
}

function registerHandlers() {
    window.onsubmit = function() {
        return false;
    }

    quiz = document.getElementById("quiz");
    quiz.addEventListener("submit", submitQuiz, false);

    qRange = document.getElementById("q_range");
    qRange.addEventListener("submit", generateFromString, false);
}
