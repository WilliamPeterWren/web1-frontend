import React from 'react';

const AddressCard = ({ address }) => {
    return (
        <div id="address-card">
            <i className="fa fa-map-marker" aria-hidden="true"></i>
            <p>{address.firstName} {address.lastName}</p>
            <p>{address.address}, {address.zip}</p>
            <p>{address.country}, {address.city}</p>
            <p>{address.telephone}</p>
        </div>
    );
}

export default AddressCard;
