var mapping = [];
var answers = [];

const letters = ["A", "B", "C", "D"];
const numbers = {
    "A" : 0,
    "B" : 1,
    "C" : 2,
    "D" : 3
};

function makeQuestion(q_obj, no) {
    question = document.createElement("fieldset");
    question.id = "question_" + (no + 1).toString()
    qtext = document.createElement("legend");
    qtext.textContent = "#" + (no + 1).toString() + " " + q_obj["question"];


    // choice_text = document.createElement("label");
    // choice_button = document.createElement("input");
    // choice_text.insertAdjacentElement("afterend", choice_button);
    for(var i = 0; i < 4; i++) {
        choice_text = document.createElement("label");
        choice_button = document.createElement("input");

        choice_button.type = "radio"
        choice_button.name = "q_" + (no + 1).toString();

        choice_text.innerText = q_obj["answers"][letters[i]]
        //choice_text.htmlFor = i.toString();

        question.appendChild(choice_button);
        question.appendChild(choice_text);
    }

    //choice_text.insertAdjacentElement("afterend", choice_button);

    question.appendChild(qtext);
    return question;
};


/* function createMapping() {
    getRandomInt(0, tech_qs.length);
} */


// 426 q's, 26 to pass
function sanitizeQs(qs) {
    in_range = qs.reduce(
        function(acc, val) {
            if(val > 426) {
                return acc;
            } else {
                acc.push(val)
                return acc;
            }
        }, [])

    no_dups = [];
    check_dups = {};

    in_range.forEach(
        function(e) {
            if(!check_dups.hasOwnProperty(e)) {
                no_dups.push(e);
                check_dups[e] = e;
            }
        }
    )

    return no_dups;
}


function choose_k(arr, k) {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    chosen = [];
    if(k > arr.length) {
        return null;
    }

    for(var l = 0; l < k; l++) {
        next_idx = getRandomInt(0, arr.length);
        chosen.push(arr[next_idx]);
        arr.splice(next_idx, 1);
    }

    return chosen;
}


function makeQuiz(str) {
    mapping = [];
    answers = [];

    quiz = document.getElementById("quiz");
    submit = document.getElementById("submit-quiz");

    while (quiz.firstChild) {
        quiz.removeChild(quiz.firstChild);
    }

    after_node = submit;

    if(str === "") {
        str = "1-426";
    }

    map = parseString(str);
    mapSanitized = sanitizeQs(map);
    console.log(mapSanitized);
    map35 = choose_k(mapSanitized, 35);

    if(map35.length < 35) {
        var errlog = document.getElementById("error");
        errlog.innerText = "Unable to generate 35 questions";
    }

    mapping = map35;
    console.log(mapping);

    for(var k = 34; k >= 0; k--) {
        answers[k] = tech_qs[mapping[k]].correct_answer;
        q = makeQuestion(tech_qs[mapping[k]], k);
        before_node = quiz.insertBefore(q, after_node);
        after_node = before_node;
    }
}

function gradeQuiz(quiz) {
    chosen = [];
    nulls = [];

    fieldsets = quiz.getElementsByTagName("fieldset");
    for(var i = 0; i < fieldsets.length; i++) {
        possible = fieldsets[i].getElementsByTagName("input");

        for(var j = 0; j < possible.length; j++) {
            if(possible[j].checked) {
                chosen.push(j)
                break;
            }
        }

        if(j == possible.length) {
            chosen.push(null)
        }
    }


    anyNull = chosen.reduce(function(acc, e) {
        acc = acc || (e == null);
        return acc;
    }, false);

    if(anyNull) {
        var errlog = document.getElementById("error");
        errlog.innerText = "Not all questions were answered!";
        return;
    }

    wrong = [];
    for(var i = 0; i < chosen.length; i++) {
        if(letters[chosen[i]] !== answers[i]) {
            wrong.push(i);
        }
    }


    /* Annotate quiz w/ results. */
    for(var i = 0; i < fieldsets.length; i++) {
        legend = fieldsets[i].getElementsByTagName("legend")[0];
        sid = tech_qs[mapping[i]].section;
        ssid = tech_qs[mapping[i]].sub_section;
        qid = tech_qs[mapping[i]].question_number;
        legend.innerHTML = "T" + sid + ssid + qid + " " + legend.innerHTML;

        possible = fieldsets[i].getElementsByTagName("label");
        idx = numbers[answers[i]];
        correct = possible[idx];
        correct.innerHTML = "-->" + " " + correct.innerHTML;
    }

    var errlog = document.getElementById("error");
    correct = 35 - wrong.length;
    if(correct >= 26) {
        errlog.innerText = "Congrats, you passed with " + correct + " correct! Score is " + correct/35.0;
    } else {
        errlog.innerText = "You got " + correct + " correct. Try again! Score is " + correct/35.0;
    }
}
