import React from 'react';
import { mount } from 'enzyme';

import { FormRenderer, componentTypes } from '@data-driven-forms/react-form-renderer';

import FormTemplate from '../form-template';
import componentMapper from '../component-mapper';
import { Select, MultiSelect, ComboBox } from 'carbon-components-react';
import { multiOnChange } from '../select';
import { getMultiValue } from '../select/select';

describe('<Select />', () => {
  it('renders select', () => {
    const schema = {
      fields: [
        {
          component: componentTypes.SELECT,
          name: 'select',
          label: 'select',
          options: [
            { label: 'option 1', value: 1 },
            { label: 'option 2', value: 2 }
          ]
        }
      ]
    };

    const wrapper = mount(
      <FormRenderer onSubmit={jest.fn()} FormTemplate={(props) => <FormTemplate {...props} />} schema={schema} componentMapper={componentMapper} />
    );

    expect(wrapper.find(Select)).toHaveLength(1);
  });

  ['isSearchable', 'isClearable'].forEach((setting) => {
    it(`renders select ${setting}`, () => {
      const schema = {
        fields: [
          {
            component: componentTypes.SELECT,
            name: 'select',
            label: 'select',
            [setting]: true,
            options: [
              { label: 'option 1', value: 1 },
              { label: 'option 2', value: 2 }
            ]
          }
        ]
      };

      const wrapper = mount(
        <FormRenderer onSubmit={jest.fn()} FormTemplate={(props) => <FormTemplate {...props} />} schema={schema} componentMapper={componentMapper} />
      );

      expect(wrapper.find(ComboBox)).toHaveLength(1);
    });
  });

  it('should render initial value label text when only value is passed as initial value', () => {
    const schema = {
      fields: [
        {
          component: componentTypes.SELECT,
          name: 'select',
          label: 'select',
          isSearchable: true,
          isClearable: true,
          options: [
            { label: 'option 1', value: 1 },
            { label: 'option 2', value: 2 }
          ]
        }
      ]
    };

    const wrapper = mount(
      <FormRenderer
        initialValues={{ select: 1 }}
        onSubmit={jest.fn()}
        FormTemplate={(props) => <FormTemplate {...props} />}
        schema={schema}
        componentMapper={componentMapper}
      />
    );

    const valueInput = wrapper.find('input[name="select"]');
    expect(valueInput).toHaveLength(1);
    expect(valueInput.props().value).toEqual('option 1');
  });

  it('should render initial value label text when only value is passed as initial value with simpleValue option', () => {
    const schema = {
      fields: [
        {
          component: componentTypes.SELECT,
          name: 'select',
          label: 'select',
          isSearchable: true,
          isClearable: true,
          simpleValue: true,
          options: [
            { label: 'option 1', value: 1 },
            { label: 'option 2', value: 2 }
          ]
        }
      ]
    };

    const wrapper = mount(
      <FormRenderer
        initialValues={{ select: 1 }}
        onSubmit={jest.fn()}
        FormTemplate={(props) => <FormTemplate {...props} />}
        schema={schema}
        componentMapper={componentMapper}
      />
    );

    const valueInput = wrapper.find('input[name="select"]');
    expect(valueInput).toHaveLength(1);
    expect(valueInput.props().value).toEqual('option 1');
  });

  it('renders multi select', () => {
    const schema = {
      fields: [
        {
          component: componentTypes.SELECT,
          name: 'select',
          label: 'select',
          initialValue: [1],
          isMulti: true,
          options: [
            { label: 'option 1', value: 1 },
            { label: 'option 2', value: 2 }
          ]
        }
      ]
    };

    const wrapper = mount(
      <FormRenderer onSubmit={jest.fn()} FormTemplate={(props) => <FormTemplate {...props} />} schema={schema} componentMapper={componentMapper} />
    );

    expect(wrapper.find(MultiSelect)).toHaveLength(1);
  });

  ['isSearchable', 'isClearable'].forEach((setting) => {
    it(`renders multi select - ${setting}`, () => {
      const schema = {
        fields: [
          {
            component: componentTypes.SELECT,
            name: 'select',
            label: 'select',
            initialValue: [1],
            isMulti: true,
            [setting]: true,
            options: [
              { label: 'option 1', value: 1 },
              { label: 'option 2', value: 2 }
            ]
          }
        ]
      };

      const wrapper = mount(
        <FormRenderer onSubmit={jest.fn()} FormTemplate={(props) => <FormTemplate {...props} />} schema={schema} componentMapper={componentMapper} />
      );

      expect(wrapper.find(MultiSelect.Filterable)).toHaveLength(1);
    });
  });

  describe('multichange', () => {
    const input = {
      onChange: jest.fn()
    };

    beforeEach(() => {
      input.onChange.mockReset();
    });

    it('simpleValue', () => {
      multiOnChange(input, true)({ selectedItems: [{ value: '123' }, { value: '345' }] });

      expect(input.onChange).toHaveBeenCalledWith(['123', '345']);
    });

    it('not simple value', () => {
      multiOnChange(input, false)({ selectedItems: [{ value: '123' }, { value: '345' }] });

      expect(input.onChange).toHaveBeenCalledWith([{ value: '123' }, { value: '345' }]);
    });
  });

  describe('getMultiValue', () => {
    let value;
    let options;

    beforeEach(() => {
      value = undefined;
      options = [];
    });

    it('undefined', () => {
      expect(getMultiValue(value, options)).toEqual([]);
    });

    it('array', () => {
      value = ['dogs'];
      options = [
        { label: 'cats', value: 'cats' },
        { label: 'dogs', value: 'dogs' }
      ];

      expect(getMultiValue(value, options)).toEqual([{ label: 'dogs', value: 'dogs' }]);
    });

    it('single', () => {
      value = 'dogs';
      options = [
        { label: 'cats', value: 'cats' },
        { label: 'dogs', value: 'dogs' }
      ];

      expect(getMultiValue(value, options)).toEqual([{ label: 'dogs', value: 'dogs' }]);
    });
  });
});
