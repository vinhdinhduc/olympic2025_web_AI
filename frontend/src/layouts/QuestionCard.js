import "../components/exercisesDetail.css";

const QuestionCard = ({
  question,
  qIndex,
  selectedAnswers,
  submitted,
  handleAnswerSelect,
}) => {
  return (
    <div
      key={qIndex}
      className={`question-card ${
        submitted && selectedAnswers[qIndex] === question.correctAnswer
          ? "correct"
          : ""
      } ${
        submitted &&
        selectedAnswers[qIndex] !== undefined &&
        selectedAnswers[qIndex] !== question.correctAnswer
          ? "incorrect"
          : ""
      }`}
    >
      <h4 className="question-text">{question.question}</h4>
      <div className="options-container">
        {question.options.map((option, oIndex) => (
          <div
            key={oIndex}
            className={`option ${
              selectedAnswers[qIndex] === oIndex ? "selected" : ""
            } ${
              submitted && oIndex === question.correctAnswer
                ? "correct-answer"
                : ""
            }`}
            onClick={() => !submitted && handleAnswerSelect(qIndex, oIndex)}
          >
            <span className="option-letter">
              {String.fromCharCode(65 + oIndex)}.
            </span>
            {option}
            {submitted && oIndex === question.correctAnswer && (
              <span className="check-mark">✓</span>
            )}
          </div>
        ))}
      </div>
      {submitted && (
        <div className="explanation">
          {selectedAnswers[qIndex] === question.correctAnswer ? (
            <p className="feedback correct-feedback">
              Chính xác! Bạn đã chọn đáp án đúng.
            </p>
          ) : (
            <p className="feedback incorrect-feedback">
              {selectedAnswers[qIndex] !== undefined
                ? `Sai rồi! Đáp án đúng là ${String.fromCharCode(
                    65 + question.correctAnswer
                  )}.`
                : `Bạn chưa chọn đáp án! Đáp án đúng là ${String.fromCharCode(
                    65 + question.correctAnswer
                  )}.`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
