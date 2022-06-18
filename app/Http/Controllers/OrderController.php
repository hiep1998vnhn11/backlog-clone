<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\CreateOrderRequest;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $params = $request->all();
        $role = isset($params['role']) ? $params['role'] : '';
        $shop = isset($params['shop']) ? $params['shop'] : '';
        $shipper = isset($params['shipper']) ? $params['shipper'] : '';
        $from_date = isset($params['from_date']) ? $params['from_date'] : '';
        $to_date = isset($params['to_date']) ? $params['to_date'] : '';
        $sortBy = isset($params['sort_by']) ? $params['sort_by'] : 'created_at';
        $acceptedSortBy = [
            'name',
            'phone',
            'address',
            'username',
            'status',
            'created_at',
        ];
        if (!in_array($sortBy, $acceptedSortBy)) {
            $sortBy = 'created_at';
        }
        $sortType = isset($params['sort_type']) ? $params['sort_type'] : 'desc';
        $acceptedSortType = [
            'asc',
            'desc',
        ];
        if (!in_array($sortType, $acceptedSortType)) {
            $sortType = 'desc';
        }
        $pagination = $this->getPagination($params);
        $query = Order::query()
            ->when($pagination['search_key'], function ($query, $search_key) {
                return $query->where(function ($q) use ($search_key) {
                    $q->where('customer_name', 'like', '%' . $search_key . '%')
                        ->orWhere('customer_phone', 'like', '%' . $search_key . '%')
                        ->orWhere('customer_address', 'like', '%' . $search_key . '%');
                });
            })
            ->when($shop, function ($query, $shop) {
                return $query->where('shop', 'like', '%' . $shop . '%');
            })
            ->when($shipper, function ($query, $shipper) {
                return $query->where('shipper', 'like', '%' . $shipper . '%');
            })
            ->when($from_date, function ($query, $from_date) {
                return $query->where('created_at', '>=', $from_date);
            })
            ->when($to_date, function ($query, $to_date) {
                return $query->where('created_at', '<=', $to_date);
            });
        $accounts = $query
            ->orderBy($sortBy, $sortType)
            ->offset($pagination['offset'])
            ->limit($pagination['limit'])
            ->get();
        $total = $query->count();

        return $this->sendRespondSuccess([
            'data' => $accounts,
            'total' => $total,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateOrderRequest $request)
    {
        $agent = User::findOrFail($request->input('agent'));
        if (!$agent->hasAnyRole('agent', 'admin')) {
            return $this->sendUnvalidated([
                'agent' => [
                    'Agent này không có quyền tiếp nhận đơn hàng!'
                ]
            ]);
        }
        if ($request->agent_share) {
            $agent_share = User::findOrFail($request->input('agent_share'));
            if (!$agent_share->hasAnyRole('agent', 'admin')) {
                return $this->sendUnvalidated([
                    'agent_share' => [
                        'Agent này không có quyền tiếp nhận share đơn hàng!'
                    ]
                ]);
            }
        }
        if ($request->shipper) {
            $shipper = User::findOrFail($request->input('shipper'));
            if (!$shipper->hasRole('shipper')) {
                return $this->sendUnvalidated([
                    'shipper' => [
                        'Shipper này không có quyền tiếp nhận đơn hàng!'
                    ]
                ]);
            }
        }
        $data = $request->validated();
        if (!isset($data['code'])) {
            $data['code'] = 'OD' . Order::query()->count() + 1;
        }
        $order = Order::create($data);
        return $this->sendRespondSuccess($order);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
