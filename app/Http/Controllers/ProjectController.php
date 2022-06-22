<?php

namespace App\Http\Controllers;

use App\Http\Requests\Project\CreateCategoryRequest;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Models\Activity;
use App\Models\Issue;
use App\Models\Member;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Project::query()
            ->select('projects.*');
        $user = auth()->user();
        if ($user->role != User::ROLE_ADMIN) {
            $query = $query->join('members', 'projects.id', '=', 'members.project_id')
                ->where('members.user_id', auth()->id())
                ->where('members.status', Member::STATUS_JOINED);
        }
        $query =  $query->paginate($request->limit ?? 12);
        return $this->sendRespondSuccess(
            $query
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateProjectRequest $request)
    {
        if (!auth()->user()->hasPermissionCreateProject()) return $this->sendForbidden();
        $project = Project::create(
            array_merge($request->validated(), [
                'user_id' => auth()->id(),
            ])
        );
        Member::create([
            'user_id' => auth()->id(),
            'project_id' => $project->id,
            'status' => Member::STATUS_JOINED,
            'joined_at' => now(),
        ]);

        Activity::create([
            'project_id' => $project->id,
            'type' => Activity::TYPE_CREATE_PROJECT,
            'data' => [
                'label' => 'Project ' . $project->name . ' has been created by ' . auth()->user()->name,
                'link' => null
            ]
        ]);
        return $this->sendRespondSuccess($request->key);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(string $project)
    {
        $project = Project::where('key', $project)->firstOrFail();
        if (!$project->hasPermissionCreateIssue(auth()->user())) return $this->sendForbidden();

        $issues = Issue::query()
            ->where('project_id', $project->id)
            ->select('tracker', DB::raw("SUM(status != 'Closed') as open"), DB::raw("SUM(status = 'Closed') as closed"))
            ->groupBy('tracker')
            ->get();
        $project->issue_tracking = $issues;

        $sumEstimateTime = Issue::query()
            ->where('project_id', $project->id)
            ->sum('estimate_time');
        $sumSpentTime = Issue::query()
            ->where('project_id', $project->id)
            ->sum('spent_time');
        $project->estimate_time = $sumEstimateTime;
        $project->spent_time = $sumSpentTime;

        $project->joined_members = $project->members()
            ->select('users.id', 'users.name')
            ->join('users', 'users.id', '=', 'members.user_id')
            ->where('members.status', Member::STATUS_JOINED)
            ->get();
        return $this->sendRespondSuccess($project);
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

    public function pluck(Request $request)
    {
        $params = $request->all();
        $searchKey = Arr::get($params, 'search_key', null);
        $projects = Project::select('projects.name', 'projects.key')
            ->join('members', 'members.project_id', '=', 'projects.id')
            ->where('members.user_id', auth()->id())
            ->where('members.status', Member::STATUS_JOINED)
            ->when($searchKey, function ($q, $searchKey) {
                $q->where('name', 'like', '%' . $searchKey . '%')
                    ->orWhere('key', 'like', '%' . $searchKey . '%');
            });
        return $this->sendRespondSuccess($projects->limit(12)->get());
    }

    public function memberAndCategory(string $projectKey)
    {
        $project = Project::where('key', $projectKey)->firstOrFail();
        $members = $project->getAllMembers();
        $categories = $project->issueCategories()->select('name as label', 'id as value')->get();
        return $this->sendRespondSuccess(
            [
                'members' => $members,
                'categories' => $categories,
            ]
        );
    }
    public function storeCategory(string $projectKey, CreateCategoryRequest $request)
    {
        $project = Project::where('key', $projectKey)->firstOrFail();
        $project->issueCategories()->create($request->validated());
        return $this->sendRespondSuccess($request->key);
    }
}
