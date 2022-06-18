<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;

class CreateAccountRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|unique:users,phone,NULL,id,deleted_at,NULL',
            'address' => 'required|string|max:255',
            'note' => 'nullable|string',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string|in:admin,agent,shipper',
            'username' => 'required|string|max:255|unique:users,username,NULL,id,deleted_at,NULL',
            'status' => 'required|string|in:active,inactive',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Hãy nhập tên',
            'phone.required' => 'Hãy nhập số điện thoại',
            'phone.regex' => 'Số điện thoại không hợp lệ',
            'phone.unique' => 'Số điện thoại đã tồn tại',
            'address.required' => 'Hãy nhập địa chỉ',
            'password.required' => 'Hãy nhập mật khẩu',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'password.confirmed' => 'Mật khẩu không khớp',
            'role.required' => 'Hãy chọn vai trò',
            'role.in' => 'Vai trò không hợp lệ',
            'username.required' => 'Hãy nhập tên đăng nhập',
            'username.unique' => 'Tên đăng nhập đã tồn tại',
            'status.required' => 'Hãy chọn trạng thái',
            'status.in' => 'Trạng thái không hợp lệ',
        ];
    }
}
