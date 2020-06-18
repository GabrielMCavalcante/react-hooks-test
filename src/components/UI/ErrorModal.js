import React from 'react'
import { CSSTransition } from 'react-transition-group'

import './ErrorModal.css'

const ErrorModal = React.memo(props => {

  return (
    <React.Fragment>
      { props.show && <div className="backdrop" onClick={props.onClose} /> }
      <CSSTransition
        in={props.show}
        timeout={300}
        unmountOnExit
        mountOnEnter
        classNames={{
          enterActive: "Open",
          exitActive: "Close"
        }}
      >
        <div className="error-modal">
          <h2>An Error Occurred!</h2>
          <p>{props.children}</p>
          <div className="error-modal__actions">
            <button type="button" onClick={props.onClose}>
              Okay
          </button>
          </div>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
})

export default ErrorModal
