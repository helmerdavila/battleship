import React from "react";

const Modal = props => {
  return (
    <div className={`modal ${props.showModal ? 'is-active' : ''}`}>
      <div className="modal-background"/>
      <div className="modal-card">
        <div className="modal-card-head">
          <p className="modal-card-title">Choose difficulty</p>
        </div>
        <div className="modal-card-body">
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" onClick={() => props.changeDifficulty("easy")} checked={props.difficulty === "easy"}/> Easy
              </label>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" onClick={() => props.changeDifficulty("medium")} checked={props.difficulty === "medium"}/> Medium
              </label>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" onClick={() => props.changeDifficulty("hard")} checked={props.difficulty === "hard"}/> Hard
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;