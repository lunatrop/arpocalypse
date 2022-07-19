import React, { Component } from 'react';
import { Engine } from './Engine';
import { Keyboard } from './Keyboard';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Engine>
          <Keyboard/>
        </Engine>
        
      </div>
    );
  }
}

export default App;
