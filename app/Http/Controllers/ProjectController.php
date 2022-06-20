<?php

namespace App\Http\Controllers;

use App\Http\Requests\Project\CreateCategoryRequest;
use App\Http\Requests\Project\CreateProjectRequest;
use App\Models\Member;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

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
            ->select('projects.*')
            ->leftJoin('members', 'projects.id', '=', 'members.project_id')
            ->where('projects.user_id', auth()->id())
            ->orWhere(function ($q) {
                $q->where('members.user_id', auth()->id())
                    ->where('members.status', Member::STATUS_INVITED);
            })
            ->paginate($request->limit ?? 12);
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
        return $this->sendRespondSuccess($request->key);
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
            ->leftJoin('members', 'members.project_id', '=', 'projects.id')
            ->where(function ($q) {
                $q->where('projects.user_id', auth()->id())
                    ->orWhere(function ($q2) {
                        $q2->where('members.user_id', auth()->id())
                            ->where('members.status', Member::STATUS_INVITED);
                    });
            })
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
