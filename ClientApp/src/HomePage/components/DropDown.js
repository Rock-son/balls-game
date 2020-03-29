import React from "react";   
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
   
export const DropDown = props => {
	const { dropdownOpen, toggle, className, isDisabled, header, text, items } = props;
   	return (		
		<ButtonDropdown className={className} isOpen={dropdownOpen} toggle={toggle} >
		<DropdownToggle caret disabled={isDisabled}>
			{text}
		</DropdownToggle>
		<DropdownMenu>
	   		<DropdownItem header>{header}</DropdownItem>
	   		{items.map(item => <DropdownItem>{item}</DropdownItem>)}
		</DropdownMenu>
		</ButtonDropdown>
   );
};
