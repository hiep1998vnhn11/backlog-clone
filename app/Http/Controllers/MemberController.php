<?php

namespace App\Http\Controllers;

use App\Http\Requests\Project\InviteMemberRequest;
use App\Models\Activity;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->project_key) return $this->sendRespondError();
        $project = Project::where('key', $request->project_key)->firstOrFail();
        if (!$project->hasPermissionCreateIssue(auth()->id())) return $this->sendForbidden();
        $searchKey = $request->search_key ?? '';
        $status = $request->status ?? '';
        $members = Member::query()
            ->join('users', 'users.id', '=', 'members.user_id')
            ->where('project_id', $project->id)
            ->when($searchKey, function ($q) use ($searchKey) {
                $q->where('users.name', 'like', "%{$searchKey}%")
                    ->orWhere('users.email', 'like', "%{$searchKey}%");
            })
            ->when($status, function ($q) use ($status) {
                $q->where('members.status', $status);
            })
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'members.status',
                'members.created_at',
                'users.avatar'
            )
            ->get();
        return $this->sendRespondSuccess($members);
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
    public function store(InviteMemberRequest $request)
    {
        $project = Project::where('key', $request->project_key)->firstOrFail();
        if (!$project->hasPermissionCreateIssue(auth()->id())) return $this->sendForbidden();
        $user = User::where('email', $request->email)->firstOrFail();
        $member = Member::query()
            ->where('project_id', $project->id)
            ->where('user_id', $user->id)
            ->first();
        if ($member) {
            return $this->sendUnvalidated([
                'email' => [
                    'This member has already been invited.'
                ]
            ]);
        }
        $member = Member::create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'status' => Member::STATUS_INVITED,
        ]);

        Activity::create([
            'project_id' => $project->id,
            'type' => Activity::TYPE_MEMBER,
            'object_id' => $user->id,
            'user_id' => $user->id,
            'data' => [
                'label' => "Member {$user->name} is invited to join the project.",
                'link' => 'members/' . $user->id,
            ]
        ]);
        // $member->sendInviteEmail();
        return $this->sendRespondSuccess();
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
    public function destroy(Member $member)
    {
        if ($member->user_id === $member->project->user_id) return $this->sendForbidden();
        if (!$member->project->hasPermissionCreateIssue(auth()->id())) return $this->sendForbidden();
        $member->delete();

        Activity::create([
            'project_id' => $member->project->id,
            'type' => Activity::TYPE_MEMBER,
            'object_id' => $member->user->id,
            'user_id' => auth()->id(),
            'data' => [
                'label' => "Member {$member->user->name} is removed from the project.",
                'link' => null,
            ]
        ]);
        return $this->sendRespondSuccess();
    }
}
