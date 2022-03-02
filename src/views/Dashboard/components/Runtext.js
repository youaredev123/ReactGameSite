import React, { Component } from 'react';
import api from '../../../ApiConfig';
import Ticker from 'react-ticker'

class Runtext extends Component {
  state = {
    run_text: '',
  }

  componentDidMount() {
    this.getRunText();
  }

  getRunText = () => {
    api.post('/admin/setting/getRunTextData').then(res => {
      if (res.data.doc[0] === undefined) {
        this.setState({ run_text: '' })
      } else {
        if (res.data.doc[0].publish_status === true) {
          this.setState({ run_text: res.data.doc[0].run_text })
        } else {
          this.setState({ run_text: '' })
        }
      }
    })
  }


  render() {


    const { run_text } = this.state;
    return (
      <div className="w-full">
        {run_text !== '' && (
          <Ticker mode = {'await'} speed = {10}>
            {({ index }) => (
              <>
                <span style = {{color: 'red', fontSize: 20}}> {run_text}</span>
              </>
            )}
          </Ticker>

        )}
      </div>
    )
  }
}

export default Runtext;