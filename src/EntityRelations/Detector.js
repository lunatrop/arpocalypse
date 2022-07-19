import React,  { Component } from 'react'
import { Maps } from './'

class Detector extends Component {
  constructor(props, state){
    super()
    this.props = props
    this.state = {
      ...state,
      messages : '',
      source: '',
      target: '',
      id:'',
      payload:[]
    }
    
    let parentProps = props
    let parentState = state
    
    let lookup = new WeakMap()
    let pair = {}
    let maps = new Maps()
    var currentObj = {}
    this.currentOp = ''
    this.payload = []
    
    this.execute = (op, ...args) => {
      /*I intended to call execute without arguments but props and state of parent
      is not accessible as I thought they would be when I instantiated them in Role*/
      
      
      if(op === 'triggerNote')
      {
        //console.log('Detector.execute(): ');
        //console.log(op);
        //console.log(args);
        //console.log('Trigger clip ' + args[0].origin.id + '(' + args[2][2] + ') with note ' + args[0].target.id + ' of clip ' + args[3]);
      }
      
      if (op === 'moveClip'){
        if(args[1].length > 0 && args[2].length > 0){
          args[0].call(this, 'reOrdered', 'clips' , {clips: args[2], clipSettings: args[1]})
        }
      }else if (op === 'moveNote')
      {
        if(args[1].length > 0){
          args[0].call(this, 'reOrdered', 'seq' , {seq: args[1]})
        }
      }
    }

    this.register = (e) => {
      currentObj = e
    }

    this.storePayload = (a) => {
      this.payload = a
    }

    this.query = (typeStr, obj, rest) => {
      var data
      if (this.payload[1] != undefined){
        data = this.payload[1]
      }else{
        data = obj.split(',')
      }
      
      var module = data[1]
      var type = data[0]
      var id = data[2]
      var rank = data[3]
      var value = data[4]

      var origin = {module, type, id, rank, value}
      var target = undefined

      type = data[0]

      if(typeStr === 'declareDrag'){
        module = data[1]
      }

      if(typeStr === 'dragenter'){
        target = rest
      }

      if(typeStr === 'dragleave'){
        target = undefined
      }

      pair = {origin, target}

      lookup.set(currentObj , pair)

      return(
        () => {
          let result = {op: 'no target', arg: 'no arg'}

          if (target != undefined){
            result = maps.search(origin, target)
          }
          this.currentOp = result
          return(this.currentOp)
        }
      )
    }

    
    
  }
  
  render(){
    return(<div className='panel'>
             <div>Connections</div>
             <div className='messages'>{this.state.messages}</div>
           </div>)
  }
}
export default Detector
/*
  patternbank to patternbank
  defaults to move
  modifier to copy
  drop = confirm
  The Corresponding Clip should also be copied?
  in the dataTransfer or via storage retrieval?

  sequence to sequence
  defaults to move
  modifier to copy
  drop = confirm

  Touch modifier? Long touch?

  Dragging a clip to the keyboard will transpose it as you slide along the keyboard.
  The nature of the transposition can be configured by the keyboard.
  eg. a straight transposition up and down the standard keys
  eg. a transposition along the modes by 'panning' the keyboard (the root key stays fixed)
  what about dragging a noteOn over the keyboard? An inversion? 

  Dropping a clip on top of a noteOn defines that note as a trigger for that pattern
  Dropping a clip on top of a noteOn that belongs to it defines the start position?
  Dropping a noteOn on top of a clip prepares a start position trigget in that clip (which is adjusted by editing that clip)

  It seems like any note associated with a clip instructs that clip to play when the note plays
  A note dropped onto many clips across tracks will trigger all of them
  A note dropped onto many clips in the same track will...trigger them in order of appearance I suppose

  How a clip dropped onto many notes? 
  Each time the note plays a new spawn of that clip will play. All the configuration for that clip effects every spawn. 
  I suppose this can be used in cases where Frequency and Repeats don't help

  How about dragging keys from the keyboard onto a pattern or a sequence?
  
  Does the dial spinner belong here?

  Keyboard slides
  Guitar strum mode
  ie dragfrom key to key
*/
