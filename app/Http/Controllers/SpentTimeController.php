<?php

namespace App\Http\Controllers;

use App\Http\Requests\SpentTime\CreateSpentTimeRequest;
use App\Models\Activity;
use App\Models\Project;
use App\Models\SpentTime;
use Illuminate\Http\Request;

class SpentTimeController extends Controller
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
        $sortBy = $request->sort_by ?? 'updated_at';
        $sortType = $request->sort_type ?? 'desc';
        $user = $request->user ?? '';
        $activity = $request->activity ?? '';
        $limit = $request->limit ?? 10;
        if (!in_array($activity, [
            'All', 'Development', 'Check'
        ])) $activity = 'All';
        if (!in_array($sortBy, [
            'updated_at', 'created_at', 'priority',
            'estimate_time', 'percent_complete', 'assignee_name',
            'category_name', 'tracker', 'subject'
        ])) $sortBy = 'updated_at';
        if (!in_array($sortType, ['asc', 'desc'])) $sortType = 'desc';

        $query = $project->spentTimes()
            ->select(
                'spent_times.*',
                'users.name as user_name',
                'issues.subject as issue_subject',
                'issues.tracker as issue_tracker',
            )
            ->leftJoin('users', 'spent_times.user_id', '=', 'users.id')
            ->leftJoin('issues', 'issues.id', '=', 'spent_times.issue_id')
            ->when($user, function ($q, $user) {
                $q->where('spent_times.user_id', $user);
            })
            ->when($activity, function ($q, $activity) {
                if ($activity !== 'All') {
                    $q->where('spent_times.activity', '=', $activity);
                }
            })
            ->orderBy($sortBy, $sortType)
            ->paginate($limit);
        return $this->sendRespondSuccess(
            $query
        );
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
    public function store(CreateSpentTimeRequest $request)
    {
        $project = Project::where('key', $request->project_key)->firstOrFail();
        if (!$project->hasPermissionCreateIssue(auth()->id())) return $this->sendForbidden();
        $issue = $project->issues()->where('id', $request->issue_id)->firstOrFail();

        $spent = SpentTime::create(array_merge(
            $request->validated(),
            [
                'project_id' => $project->id,
            ]
        ));

        $issue->update(
            [
                'spent_time' => $issue->spents()->sum('hours'),
            ]
        );

        Activity::create([
            'user_id' => auth()->id(),
            'project_id' => $project->id,
            'object_id' => $request->user_id,
            'type' => Activity::TYPE_SPENT_TIME,
            'data' => [
                'label' => auth()->user()->name . ' added spent time: ' . $spent->hours . ' hours',
                'link' => 'spents/' . $spent->id,
            ]
        ]);

        return $this->sendRespondSuccess(
            $spent->id
        );
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
