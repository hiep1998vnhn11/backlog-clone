<?php

namespace App\Http\Controllers;

use App\Http\Requests\Issue\CreateIssueRequest;
use App\Http\Requests\Issue\UpdateIssueRequest;
use App\Models\Activity;
use App\Models\Issue;
use App\Models\Project;
use Illuminate\Http\Request;

class IssueController extends Controller
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
        if (!$project->hasPermissionShowIssue(auth()->user())) return $this->sendForbidden();
        $sortBy = $request->sort_by ?? 'updated_at';
        $sortType = $request->sort_type ?? 'desc';
        $searchKey = $request->search_key ?? '';
        $assignee = $request->assignee ?? '';
        $category = $request->category ?? '';
        $status = $request->status ?? '';
        $dateType = $request->date_type ?? '';
        $date = $request->date ?? '';
        $limit = $request->limit ?? 10;
        if (!in_array($status, [
            'All', 'In progress', 'Resolved', 'Closed', 'Not closed',
            'Open',
        ])) $status = 'All';
        if (!in_array($sortBy, [
            'updated_at', 'created_at', 'priority',
            'estimate_time', 'percent_complete', 'assignee_name',
            'category_name', 'tracker', 'subject', 'id'
        ])) $sortBy = 'updated_at';
        if (!in_array($sortType, ['asc', 'desc'])) $sortType = 'desc';

        $query = $project->issues()
            ->select(
                'issues.*',
                'assignee.name as assignee_name',
                'issue_categories.name as category_name',
            )
            ->leftJoin('users as assignee', 'issues.assignee_id', '=', 'assignee.id')
            ->leftJoin('issue_categories', 'issues.category_id', '=', 'issue_categories.id')
            ->when($searchKey, function ($q, $searchKey) {
                $q->where('issues.subject', 'like', "%{$searchKey}%");
            })
            ->when($assignee, function ($q, $assignee) {
                $q->where('issues.assignee_id', $assignee);
            })
            ->when($category, function ($q, $category) {
                $q->where('issues.category_id', $category);
            })
            ->when($status, function ($q, $status) {
                if ($status !== 'All') {
                    if ($status === 'Not closed') {
                        $q->where('issues.status', '!=', 'Closed');
                    } else {
                        $q->where('issues.status', $status);
                    }
                }
            })
            ->when($dateType, function ($q, $dateType) use ($date) {
                if ($dateType === 'day') {
                    if ($date) {
                        $q->whereDate('issues.start_date', $date);
                    }
                } else {
                    $now = now();
                    if ($dateType === 'week') {
                        $monDay = $now->startOfWeek()->format('Y-m-d');
                        $sunday = $now->endOfWeek()->format('Y-m-d');
                        $q->whereDate('issues.start_date', '>=', $monDay)
                            ->whereDate('issues.start_date', '<=', $sunday);
                    } elseif ($dateType === 'month') {
                        $monthDay = $now->startOfMonth()->format('Y-m-d');
                        $endMonth = $now->endOfMonth()->format('Y-m-d');
                        $q->whereDate('issues.start_date', '>=', $monthDay)
                            ->whereDate('issues.start_date', '<=', $endMonth);
                    } else if ($dateType === 'today') {
                        $q->whereDate('issues.start_date', $now->format('Y-m-d'));
                    } else if ($dateType === 'last_month') {
                        $now = $now->subMonth();
                        $monthDay = $now->startOfMonth()->format('Y-m-d');
                        $endMonth = $now->endOfMonth()->format('Y-m-d');
                        $q->whereDate('issues.start_date', '>=', $monthDay)
                            ->whereDate('issues.start_date', '<=', $endMonth);
                    }
                }
            })
            ->orderBy($sortBy, $sortType)
            ->paginate($limit);
        return $this->sendRespondSuccess($query);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateIssueRequest $request)
    {
        $project = Project::where('key', $request->project_key)
            ->firstOrFail();
        if (!$project->hasPermissionShowIssue(auth()->user())) return $this->sendForbidden();

        $issue = Issue::create(
            array_merge($request->validated(), [
                'user_id' => auth()->id(),
                'project_id' => $project->id,
                'estimate_time' => $request->estimate_time ?? 0,
                'percent_complete' => $request->percent_complete ?? 0,
            ])
        );

        Activity::create([
            'project_id' => $project->id,
            'type' => Activity::TYPE_ISSUE,
            'object_id' => $issue->id,
            'user_id' => $issue->assignee_id,
            'data' => [
                'label' => "{$issue->tracker}#{$issue->id} (Open): {$issue->subject}",
                'link' => 'issues/' . $issue->id,
            ]
        ]);

        return $this->sendRespondSuccess($issue->id);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Issue $issue, Request $request)
    {
        if (!$request->project_key) return $this->sendRespondError();
        $project = Project::where('key', $request->project_key)->firstOrFail();
        if (!$project->hasPermissionShowIssue(auth()->user())) return $this->sendForbidden();
        if ($project->id !== $issue->project_id) return $this->sendForbidden();
        $issue->load([
            'comments',
            'assignee',
            'category',
            'user'
        ]);
        return $this->sendRespondSuccess($issue);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateIssueRequest $request, Issue $issue)
    {
        if (!$issue->project->hasPermissionShowIssue(auth()->user())) return $this->sendForbidden();
        $issue->update($request->validated());

        Activity::create([
            'project_id' => $issue->project->id,
            'type' => Activity::TYPE_ISSUE,
            'object_id' => $issue->id,
            'user_id' => $issue->assignee_id,
            'data' => [
                'label' => "{$issue->tracker}#{$issue->id} ({$issue->status}): {$issue->subject}",
                'link' => 'issues/' . $issue->id,
            ]
        ]);
        return $this->sendRespondSuccess();
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

    public function spents(Issue $issue)
    {
        if (!$issue->project->hasPermissionShowIssue(auth()->user())) return $this->sendForbidden();
        $spents = $issue->spents()
            ->select('spent_times.*', 'users.name as user_name')
            ->leftJoin('users', 'spent_times.user_id', '=', 'users.id')
            ->orderBy('created_at', 'desc')
            ->get();
        return $this->sendRespondSuccess($spents);
    }

    public function comments(Issue $issue)
    {
        if (!$issue->project->hasPermissionShowIssue(auth()->user())) return $this->sendForbidden();
        $spents = $issue->comments()
            ->select('comments.*', 'users.name as user_name', 'users.avatar as user_avatar')
            ->leftJoin('users', 'comments.user_id', '=', 'users.id')
            ->orderBy('created_at', 'desc')
            ->get();
        return $this->sendRespondSuccess($spents);
    }
}
