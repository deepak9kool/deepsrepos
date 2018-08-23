import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal,Row,Col,Panel,Well ,Button,ButtonGroup,Label } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { deleteCartItem,updateCart } from '../../actions/cartActions';


class Cart extends Component {

    constructor(props) {
        super(props);
        this.state={
            show:false
        }
    }

    close(){
        this.setState({show:false})
    }
    open(){
        this.setState({show:true})
    }

    onDelete(_id){

        const currentBookToDelete = this.props.cart;
        const indexToDelete = currentBookToDelete.findIndex(
            function(cart){
                return cart._id===_id
            }
        )
        let cartAfterDelete= [...currentBookToDelete.slice(0,indexToDelete),
        ...currentBookToDelete.slice(indexToDelete+1)]

        this.props.deleteCartItem(cartAfterDelete);
    }
    onIncrement(_id){
        this.props.updateCart(_id,1,this.props.cart)
    }
    onDecrement(_id,quantity){
        if(quantity>1){
            this.props.updateCart(_id,-1,this.props.cart)
        }
        
    }
    render() {
        if(this.props.cart[0]){
            return this.renderCart();
        }
        else{
            return this.renderEmpty();
        }
    }
    renderEmpty(){
        return (<div></div>)
    }
    renderCart(){
        const cartItemList = this.props.cart.map(function(cartArr){
            return(
                <Panel key={cartArr._id}>
                    <Row>
                        <Col xs={12} sm={4}>
                            <h6>{cartArr.title}</h6><span>    </span>  
                        </Col>
                        <Col xs={12} sm={2}>
                            <h6>usd. {cartArr.price}</h6> 
                        </Col>
                        <Col xs={12} sm={2}>
                            <h6>qty. <Label bsStyle='success'>{cartArr.quantity}</Label></h6>  
                        </Col>
                        <Col xs={6} sm={4}>
                            <ButtonGroup style={{minWidth:'300px'}}>
                                <Button onClick={this.onDecrement.bind(this,cartArr._id,cartArr.quantity)} bsSize='default' bsSize='small'>-</Button>
                                <Button onClick={this.onIncrement.bind(this,cartArr._id)} bsSize='default' bsSize='small'>+</Button>
                                <span>   </span>
                                <Button onClick={this.onDelete.bind(this,cartArr._id)} bsStyle='danger' bsSize='small'>Delete</Button>
                            </ButtonGroup>  
                        </Col>
                    </Row>
                </Panel>
            )
        },this)
        return(
            // <Panel header="cart" bsStyle="primary">
            //     {cartItemList}
            // </Panel>
            <Panel bsStyle="primary">
              <Panel.Heading>
                <Panel.Title componentClass="h3">Cart</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                    {cartItemList}
                    <Row>
                        <Col xs={12}>
                            <h6>Total Amount : {this.props.totalAmount} </h6>
                            <Button onClick={this.open.bind(this)} bsStyle='success'>Proceed to checkout</Button>
                        </Col>
                    </Row>
                    <Modal show={this.state.show} onHide={this.close.bind(this)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Thank you!</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <h6>Your order has been saved</h6>
                        <p>You will reive an email confirmation</p>
                      </Modal.Body>
                      <Modal.Footer>
                         <Col xs={6}>
                            <h6>Total $: {this.props.totalAmount}</h6>
                         </Col> 
                        <Button onClick={this.close.bind(this)}>Close</Button>
                      </Modal.Footer>
                    </Modal>
              </Panel.Body>
            </Panel>
        ) 
    }
}

function mapStateToProps(state){
    return {
        cart: state.cart.cart,
        totalAmount:state.cart.totalAmount
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({deleteCartItem,updateCart},dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(Cart);