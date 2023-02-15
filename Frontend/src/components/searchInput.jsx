import React, { forwardRef } from 'react';
import { Select } from 'antd';

const SearchInput = forwardRef((props, ref) => {

  return (
    <Select
      showSearch
      value={props.value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      showArrow={props.isLoadingCustomers}
      filterOption={false}
      onSearch={props.onSearch}
      onChange={props.onChange}
      notFoundContent={null}
      loading={props.isLoadingCustomers}
      ref={ref}
    >
      {props.options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option?.new ? (
            <i
              className="fa fa-user-plus"
              aria-hidden="true"
              style={{ fontSize: '17px' }}
            >
              {' '}
              {option.label}
            </i>
          ) : (
            <i
              className="fa fa-user-circle"
              aria-hidden="true"
              style={{ fontSize: '17px' }}
            >
              {' '}
              {option.label}
            </i>
          )}
        </Select.Option>
      ))}
    </Select>
  );
});

export default SearchInput;