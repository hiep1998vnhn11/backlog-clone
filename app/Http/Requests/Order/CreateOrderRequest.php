<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'agent' => 'required|numeric|exists:users,id',
            'agent_share' => 'nullable|numeric|exists:users,id',
            'shipper' => 'nullable|numeric|exists:users,id',
            'note' => 'nullable|string',
            'shop' => 'required|string',
            'code' => 'nullable|string|max:16|unique:orders,code',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_address' => 'required|string|max:255',
            'customer_note' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'agent.required' => 'Chưa chọn nhân viên giao hàng',
            'agent.numeric' => 'Nhân viên giao hàng không hợp lệ',
            'agent.exists' => 'Nhân viên giao hàng không tồn tại',
            'agent_share.numeric' => 'Nhân viên giao hàng không hợp lệ',
            'agent_share.exists' => 'Nhân viên giao hàng không tồn tại',
            'shipper.numeric' => 'Nhân viên giao hàng không hợp lệ',
            'shipper.exists' => 'Nhân viên giao hàng không tồn tại',
            'note.string' => 'Ghi chú không hợp lệ',
            'shop.string' => 'Shop không hợp lệ',
            'shop.required' => 'Chưa chọn Shop!',
            'code.string' => 'Mã đơn hàng không hợp lệ',
            'code.max' => 'Mã đơn hàng không hợp lệ',
            'customer_name.required' => 'Chưa nhập tên khách hàng',
            'customer_name.string' => 'Tên khách hàng không hợp lệ',
            'customer_phone.required' => 'Chưa nhập số điện thoại khách hàng',
            'customer_phone.string' => 'Số điện thoại khách hàng không hợp lệ',
            'customer_address.required' => 'Chưa nhập địa chỉ khách hàng',
            'customer_address.string' => 'Địa chỉ khách hàng không hợp lệ',
            'customer_address.max' => 'Địa chỉ khách hàng không hợp lệ',
            'customer_note.string' => 'Ghi chú không hợp lệ',
        ];
    }
}
