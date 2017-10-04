import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Map, Widgets, Popup, Symbols, Graphic} from 'react-arcgis';
import * as esriLoader from 'esri-loader';
import {dojoRequire} from "esri-loader";
import EsriLoader from 'esri-loader-react';


class Main extends React.Component {

  constructor (props) {
    super(props)
    this.state = { mapLoaded: false }
  }

  render () {
    // show any map errors
    const error = this.state.error
    if (error) {
      return <div className='container'>
        <div className='alert alert-danger alert-map'>{error}</div>
        <button className='btn btn-default' onClick={hashHistory.goBack}>Go back</button>
      </div>
    }
    // otherwise, show map
    const item = this.state.item
    const title = item && item.title
    const link = item ? `https://www.arcgis.com/home/item.html?id=${item.id}` : 'javascript:void(0)'
    // show a loading indicator until the map is loaded
    const loadingStyle = {
      display: this.state.mapLoaded ? 'none' : 'block'
    }
    // show the map title
    const titleStyle = {
      display: title ? 'block' : 'none'
    }
    // set up the DOM to attach the map to
    return <div>
      <div className='map-title' style={titleStyle}><a href={link}>{title}</a></div>
      <div ref='map' style={{height: 'calc(100vh - 66px)'}} />
      <div className='loading' >Loading...</div>
    </div>
  }

  createMap() {
    // first, we use Dojo's loader to require the map class
    esriLoader.dojoRequire(['esri/map'], (Map) => {
      // create map with the given options at a DOM node w/ id 'mapNode'
      let map = new Map('mapNode', {
        center: [-118, 34.5],
        zoom: 8,
        basemap: 'dark-gray'
      });
    });
  }

  componentDidMount () {
    esriLoader.bootstrap((err) => {
      if (err) {
        // handle any loading errors
        console.error(err);
      } else {
        // optionall execute any code once it's preloaded
        this.createMap();
      }
    }, {
      // use a specific version instead of latest 4.x
      url: 'https://js.arcgis.com/3.21/'
    });
    console.log('loading modules')
    console.time('modules loaded')
    // get item id from route params or use default
    const itemId =  '8e42e164d4174da09f61fe0d3f206641'
    // require the map class
    dojoRequire(['esri/arcgis/utils'], (arcgisUtils) => {
      console.timeEnd('modules loaded')
      console.log('loading map')
      console.time('map loaded')
      // create a map at a DOM node in this component
      arcgisUtils.createMap(itemId, this.refs.map)
      .then((response) => {
        console.timeEnd('map loaded')
        // hide the loading indicator
        // and show the map title
        // NOTE: this will trigger a rerender
        this.setState({
          mapLoaded: true,
          item: response.itemInfo.item
        })
      }, (err) => {
        this.setState({
          mapLoaded: true,
          error: err.message || err
        })
      })
    })
  }
};

export default Main;