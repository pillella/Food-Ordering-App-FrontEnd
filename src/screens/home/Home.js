import React from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      nodatamsg:false,
      restaurantList:[],
      filteredRestaurantList:[],
    }
  }

  getGridListCols = () => {
      if (isWidthUp('xl', this.props.width)) {
        return 6;
      }

      if (isWidthUp('lg', this.props.width)) {
        return 5;
      }

      if (isWidthUp('md', this.props.width)) {
        return 4;
      }
      if (isWidthUp('sm', this.props.width)) {
        return 2
      }
      return 1;
  }

  searchHandler = (value) => {
    if (value !== '') {
      this.findRestaurantApiCall(value);
    }else {
      this.getAllRestaurantsApiCall();
    }
  }

  itemClickHandler= (id)=>{
    console.log('id',id);
    // sessionStorage.setItem('currentRest',id);
    this.props.setRestaurantId(id);
    this.props.history.push(`/details/${id}`);
  }

  render(){
    const { filteredRestaurantList } = this.state;
    const { restaurants } = filteredRestaurantList || {};
    return(
      <div style={{marginTop:100}}>
        <Header
          screen="Home"
          searchHandler={this.searchHandler}/>
        <div>
          <GridList cellHeight={'auto'} cols={this.getGridListCols()}>
            {restaurants
              && Array.isArray(restaurants)
              && restaurants.length > 0
              && restaurants.map(item =>(
              <GridListTile key={item.id}>
                <HomeItem
                  onItemClick={this.itemClickHandler}
                  item={item}
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
        <div>
        {this.state.nodatamsg===true 
        && (<span>No restaurant with the given name</span>)
      }</div>
      </div>
          
    );
  }

  componentDidMount(){
    this.getAllRestaurantsApiCall();
  }

  getAllRestaurantsApiCall = () => {
    let that = this;
    let url = 'http://localhost:8080/api/restaurant';
    return fetch(url,{
      method:'GET',
    }).then((response) =>{
      if (response.ok) {
        return response.json();
      }
    }).then((responseJson)=>{
      console.log('Resp',responseJson);
      that.setState({
        nodatamsg:false,
        restaurantList:responseJson,
        filteredRestaurantList:responseJson
      });
    }).catch((error) => {
      console.log('error login data',error);
    });
  }

  findRestaurantApiCall = (value) => {
    let that = this;
    let url = `http://localhost:8080/api/restaurant/name/${value}`;
    return fetch(url,{
      method:'GET',
    }).then((response) =>{
      if (response.ok) {
        return response.json();
      }
    }).then((responseJson)=>{
      that.setState({
        nodatamsg:false,
        restaurantList:responseJson,
        filteredRestaurantList:responseJson
      });
      if (responseJson.restaurants==null){
        that.setState({nodatamsg:true});
      }
    }).catch((error) => {
      console.log('error login data',error);
    });
  }

}

function HomeItem(props){
  const{item} = props;
  return(
    <div className="home-item-main-container">
      <Card style={{width:280}}>
        <CardActionArea onClick={(e)=>props.onItemClick(item.id)}>
          <CardMedia
            component="img"
            alt={item.restaurant_name}
            style={{objectFit: 'cover'}}
            height="140"
            image={item.photo_URL}
            title={item.restaurant_name}/>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {item.restaurant_name}
            </Typography>
            <Typography component="p">
              {item.categories}
            </Typography>
            <div style={{marginTop:25,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',flexDirection:'row',backgroundColor:"#FDD835",padding:5,justifyContent:'space-evenly',alignItems:'center',width:80}}>
                <FontAwesomeIcon icon="star" color="white"/>
                <span className="white">{item.customer_rating}({item.number_customers_rated})</span>
              </div>
              <div>
                <FontAwesomeIcon size="sm" icon="rupee-sign" color="black"/>
                <span>{item.average_price} for two</span>
              </div>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}

export default withWidth()(Home);
