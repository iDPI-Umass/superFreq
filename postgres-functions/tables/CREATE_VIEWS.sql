create view public.blocks as
select
  blocks.user_id,
  block_user.username,
  blocks.target_user_id,
  target_user.username as target_username,
  blocks.type,
  blocks.active
from
  user_moderation_actions blocks
  left join profiles block_user on block_user.id = blocks.user_id
  left join profiles target_user on target_user.id = blocks.target_user_id
where
  blocks.type = 'block'::text
  and blocks.active = true;

create view public.collection_activity as
select
  activity.id,
  activity.updated_at,
  activity.updated_by,
  collection.collection_id,
  collection.title as collection_title,
  collection.owner_id as collection_owner_id,
  collection.is_top_albums,
  collection.status,
  profile.id as user_id,
  profile.username as updated_by_username,
  profile.display_name as updated_by_display_name
from
  collections_updates activity
  left join collections_info collection on collection.collection_id = activity.collection_id
  left join profiles profile on activity.updated_by = profile.id;

create view public.collection_follows as
select
  info.collection_id,
  info.title,
  info.owner_id,
  info.status,
  info.updated_at as collection_updated_at,
  array_agg(distinct followers.user_id) as followers,
  count(distinct followers.user_id)::integer as follow_count,
  array_agg(distinct collaborators.user_id) as collaborators,
  count(distinct collaborators.user_id)::integer as collaborator_count
from
  collections_info info
  left join social_graph follows on follows.collection_id = info.collection_id
  left join social_graph followers on followers.collection_id = follows.collection_id
  and followers.follows_now = true
  left join social_graph collaborators on collaborators.collection_id = follows.collection_id
  and followers.user_role = 'collaborator'::text
group by
  follows.id,
  info.collection_id,
  info.title,
  info.owner_id,
  info.status,
  info.updated_at;

create view public.collection_metadata as
select
  info.collection_id,
  info.updated_at,
  info.title,
  info.owner_id,
  info.is_top_albums,
  info.status,
  info.description_text,
  info.default_view_sort,
  profile.username,
  profile.display_name,
  profile.avatar_url,
  profile.last_fm_avatar_url,
  info.title_search,
  info.description_text as description,
  count(distinct reaction.id) as reaction_count,
  array_agg(distinct reaction.user_id) as reaction_user_ids,
  count(distinct comments.id) as comment_count,
  array_agg(distinct comments.id) as comment_ids,
  info.created_at
from
  collections_info info
  left join profile_display profile on info.owner_id = profile.user_id
  left join reactions reaction on reaction.collection_id = info.collection_id
  and reaction.active = true
  and reaction.post_id is null
  left join posts comments on comments.parent_collection_id = info.collection_id
  and (
    comments.status = 'new'::text
    or comments.status = 'edited'::text
  )
group by
  info.collection_id,
  profile.username,
  profile.display_name,
  profile.avatar_url,
  profile.last_fm_avatar_url;

create view public.collections as
select
  contents.id as original_id,
  collection.collection_id,
  collection.title,
  collection.updated_at as collection_updated_at,
  contents.item_position,
  contents.item_type,
  contents.inserted_at,
  contents.inserted_by,
  inserted_user.username as inserted_by_username,
  inserted_user.display_name as inserted_by_display_name,
  release_groups.release_group_mbid,
  release_groups.release_group_name,
  release_groups.img_url,
  release_groups.last_fm_img_url,
  release_groups.release_date as release_group_release_date,
  artists.artist_mbid,
  artists.artist_name,
  artists.discogs_img_url as artist_discogs_img_url,
  recordings.recording_mbid,
  recordings.recording_name,
  recordings.remixer_artist_mbid,
  recordings.release_date as recording_release_date,
  remixer_artist.artist_name as remixer_artist_name,
  user_added_metadata.artist_name as user_added_artist_name,
  user_added_metadata.release_group_name as user_added_release_group_name,
  user_added_metadata.recording_name as user_added_recording_name,
  user_added_metadata.episode_title as user_added_episode_title,
  user_added_metadata.show_title as user_added_show_title,
  connected_collection.collection_id as connected_collection_id,
  connected_collection.title as connected_collection_title,
  connected_collection.owner_id as connected_collection_owner_id,
  connected_collection_owner.display_name as connected_collection_owner_display_name,
  connected_collection_owner.username as connected_collection_owner_username,
  connected_collection.created_at as connected_collection_created_at,
  connected_collection.description_text as connected_collection_description_text
from
  collections_info collection
  left join collections_contents contents on collection.collection_id = contents.collection_id
  left join release_groups on release_groups.release_group_mbid = contents.release_group_mbid
  left join artists on contents.artist_mbid = artists.artist_mbid
  left join recordings on contents.recording_mbid = recordings.recording_mbid
  left join artists remixer_artist on recordings.remixer_artist_mbid = remixer_artist.artist_mbid
  left join user_added_metadata on contents.user_added_metadata_id = user_added_metadata.id
  left join collections_info connected_collection on contents.connected_collection_id = connected_collection.collection_id
  left join profiles connected_collection_owner on connected_collection.owner_id = connected_collection_owner.id
  left join profiles inserted_user on inserted_user.id = contents.inserted_by;

create view public.feed_items as
select
  'now_playing_post'::text as item_type,
  now_playing_post.id as post_id,
  now_playing_post.text,
  now_playing_post.user_id,
  profile.username,
  profile.display_name,
  profile.avatar_url,
  profile.last_fm_avatar_url,
  profile.avatar_release_group_name,
  profile.avatar_artist_name,
  now_playing_post.artist_mbid,
  now_playing_post.release_group_mbid,
  now_playing_post.recording_mbid,
  now_playing_post.artist_name,
  now_playing_post.release_group_name,
  now_playing_post.recording_name,
  now_playing_post.user_added_artist_name,
  now_playing_post.user_added_release_group_name,
  now_playing_post.user_added_recording_name,
  now_playing_post.episode_title,
  now_playing_post.show_title,
  now_playing_post.status,
  now_playing_post.created_at as "timestamp",
  now_playing_post.updated_at,
  now_playing_post.listen_url,
  now_playing_post.embed_id,
  now_playing_post.embed_source,
  now_playing_post.embed_account,
  now_playing_post.user_added_metadata_id,
  now_playing_post.replies,
  now_playing_post.reaction_count::integer as reaction_count,
  now_playing_post.reaction_user_ids,
  null::bigint as reaction_post_id,
  null::timestamp with time zone as reaction_post_created_at,
  null::uuid as reaction_post_user_id,
  null::text as reaction_post_username,
  null::text as reaction_post_display_name,
  null::text as reaction_post_type,
  null::text as reaction_post_status,
  now_playing_post.parent_post_id,
  now_playing_post.parent_post_created_at,
  now_playing_post.parent_post_user_id,
  now_playing_post.parent_post_username,
  now_playing_post.parent_post_display_name,
  now_playing_post.parent_post_type,
  now_playing_post.parent_post_status,
  null::bigint as reply_to,
  null::uuid as reply_to_user_id,
  null::text as reply_to_username,
  null::text as reply_to_display_name,
  null::timestamp with time zone as reply_to_created_at,
  null::bigint as reaction_id,
  null::boolean as reaction_active,
  null::bigint as follow_id,
  null::uuid as target_user_id,
  null::text as target_username,
  null::text as target_display_name,
  null::boolean as follows_now,
  null::bigint as collection_follow_id,
  null::bigint as collection_id,
  null::text as collection_title,
  null::text as collection_status,
  null::uuid as collection_owner_id,
  null::bigint as collection_edit_id,
  null::boolean as is_top_albums
from
  posts_and_engagement now_playing_post
  left join profile_display profile on profile.user_id = now_playing_post.user_id
where
  now_playing_post.parent_post_id is null
  and now_playing_post.type = 'now_playing'::text
union
select
  'comment'::text as item_type,
  comment.id as post_id,
  comment.text,
  comment.user_id,
  profile.username,
  profile.display_name,
  profile.avatar_url,
  profile.last_fm_avatar_url,
  profile.avatar_release_group_name,
  profile.avatar_artist_name,
  parent_post.artist_mbid,
  parent_post.release_group_mbid,
  parent_post.recording_mbid,
  parent_post.artist_name,
  parent_post.release_group_name,
  parent_post.recording_name,
  parent_post.user_added_artist_name,
  parent_post.user_added_release_group_name,
  parent_post.user_added_recording_name,
  parent_post.episode_title,
  parent_post.show_title,
  comment.status,
  comment.created_at as "timestamp",
  comment.updated_at,
  parent_post.listen_url,
  parent_post.embed_id,
  parent_post.embed_source,
  parent_post.embed_account,
  parent_post.user_added_metadata_id,
  comment.replies,
  comment.reaction_count,
  comment.reaction_user_ids,
  null::bigint as reaction_post_id,
  null::timestamp with time zone as reaction_post_created_at,
  null::uuid as reaction_post_user_id,
  null::text as reaction_post_username,
  null::text as reaction_post_display_name,
  null::text as reaction_post_type,
  null::text as reaction_post_status,
  comment.parent_post_id,
  comment.parent_post_created_at,
  comment.parent_post_user_id,
  comment.parent_post_username,
  comment.parent_post_display_name,
  comment.parent_post_type,
  comment.parent_post_status,
  comment.reply_to,
  null::uuid as reply_to_user_id,
  null::text as reply_to_username,
  null::text as reply_to_display_name,
  null::timestamp with time zone as reply_to_created_at,
  null::bigint as reaction_id,
  null::boolean as reaction_active,
  null::bigint as follow_id,
  null::uuid as target_user_id,
  null::text as target_username,
  null::text as target_display_name,
  null::boolean as follows_now,
  null::bigint as collection_follow_id,
  comment.parent_collection_id as collection_id,
  comment.parent_collection_title as collection_title,
  null::text as collection_status,
  comment.parent_collection_owner_id as collection_owner_id,
  null::bigint as collection_edit_id,
  null::boolean as is_top_albums
from
  posts_and_engagement comment
  left join posts_and_engagement parent_post on parent_post.id = comment.parent_post_id
  left join profile_display profile on profile.user_id = comment.user_id
where
  comment.status <> 'deleted'::text
  and comment.parent_post_id is not null
  and comment.parent_post_status <> 'deleted'::text
  and comment.parent_post_id = comment.reply_to
union
select
  'reply_to_reply'::text as item_type,
  comment.id as post_id,
  comment.text,
  comment.user_id,
  profile.username,
  profile.display_name,
  profile.avatar_url,
  profile.last_fm_avatar_url,
  profile.avatar_release_group_name,
  profile.avatar_artist_name,
  parent_post.artist_mbid,
  parent_post.release_group_mbid,
  parent_post.recording_mbid,
  parent_post.artist_name,
  parent_post.release_group_name,
  parent_post.recording_name,
  parent_post.user_added_artist_name,
  parent_post.user_added_release_group_name,
  parent_post.user_added_recording_name,
  parent_post.episode_title,
  parent_post.show_title,
  comment.status,
  comment.created_at as "timestamp",
  comment.updated_at,
  parent_post.listen_url,
  parent_post.embed_id,
  parent_post.embed_source,
  parent_post.embed_account,
  parent_post.user_added_metadata_id,
  comment.replies,
  comment.reaction_count,
  comment.reaction_user_ids,
  null::bigint as reaction_post_id,
  null::timestamp with time zone as reaction_post_created_at,
  null::uuid as reaction_post_user_id,
  null::text as reaction_post_username,
  null::text as reaction_post_display_name,
  null::text as reaction_post_type,
  null::text as reaction_post_status,
  comment.parent_post_id,
  comment.parent_post_created_at,
  comment.parent_post_user_id,
  comment.parent_post_username,
  comment.parent_post_display_name,
  comment.parent_post_type,
  comment.parent_post_status,
  comment.reply_to,
  comment.reply_to_user_id,
  comment.reply_to_username,
  comment.reply_to_display_name,
  comment.reply_to_created_at,
  null::bigint as reaction_id,
  null::boolean as reaction_active,
  null::bigint as follow_id,
  null::uuid as target_user_id,
  null::text as target_username,
  null::text as target_display_name,
  null::boolean as follows_now,
  null::bigint as collection_follow_id,
  comment.parent_collection_id as collection_id,
  comment.parent_collection_title as collection_title,
  null::text as collection_status,
  comment.parent_collection_owner_id as collection_owner_id,
  null::bigint as collection_edit_id,
  null::boolean as is_top_albums
from
  posts_and_engagement comment
  left join posts_and_engagement parent_post on parent_post.id = comment.parent_post_id
  left join profile_display profile on profile.user_id = comment.user_id
where
  comment.status <> 'deleted'::text
  and comment.parent_post_id is not null
  and comment.parent_post_status <> 'deleted'::text
  and comment.parent_post_id <> comment.reply_to
union
select
  'reaction'::text as item_type,
  null::bigint as post_id,
  null::text as text,
  reactions_metadata.user_id,
  reactions_metadata.username,
  reactions_metadata.display_name,
  reactions_metadata.avatar_url,
  reactions_metadata.last_fm_avatar_url,
  reactions_metadata.avatar_release_group_name,
  reactions_metadata.avatar_artist_name,
  null::text as artist_mbid,
  null::text as release_group_mbid,
  null::text as recording_mbid,
  reactions_metadata.reaction_post_artist_name as artist_name,
  reactions_metadata.reaction_post_release_group_name as release_group_name,
  reactions_metadata.reaction_post_recording_name as recording_name,
  reactions_metadata.reaction_post_user_added_artist_name as user_added_artist_name,
  reactions_metadata.reaction_post_user_added_release_group_name as user_added_release_group_name,
  reactions_metadata.reaction_post_user_added_recording_name as user_added_recording_name,
  reactions_metadata.reaction_post_episode_title as episode_title,
  null::text as show_title,
  null::text as status,
  reactions_metadata.updated_at as "timestamp",
  reactions_metadata.updated_at,
  null::text as listen_url,
  null::text as embed_id,
  null::text as embed_source,
  null::text as embed_account,
  null::bigint as user_added_metadata_id,
  null::bigint[] as replies,
  null::bigint as reaction_count,
  null::uuid[] as reaction_user_ids,
  reactions_metadata.reaction_post_id,
  reactions_metadata.reaction_post_created_at,
  reactions_metadata.reaction_post_user_id,
  reactions_metadata.reaction_post_username,
  reactions_metadata.reaction_post_display_name,
  reactions_metadata.reaction_post_type,
  reactions_metadata.reaction_post_status,
  reactions_metadata.parent_post_id,
  reactions_metadata.parent_post_created_at,
  reactions_metadata.parent_post_user_id,
  reactions_metadata.parent_post_username,
  reactions_metadata.parent_post_display_name,
  reactions_metadata.parent_post_type,
  reactions_metadata.parent_post_status,
  null::bigint as reply_to,
  null::uuid as reply_to_user_id,
  null::text as reply_to_username,
  null::text as reply_to_display_name,
  null::timestamp with time zone as reply_to_created_at,
  reactions_metadata.id as reaction_id,
  reactions_metadata.active as reaction_active,
  null::bigint as follow_id,
  null::uuid as target_user_id,
  null::text as target_username,
  null::text as target_display_name,
  null::boolean as follows_now,
  null::bigint as collection_follow_id,
  reactions_metadata.collection_id,
  reactions_metadata.collection_title,
  null::text as collection_status,
  reactions_metadata.collection_owner_id,
  null::bigint as collection_edit_id,
  null::boolean as is_top_albums
from
  reactions_metadata
where
  reactions_metadata.active = true
union
select
  'social_follow'::text as item_type,
  null::bigint as post_id,
  null::text as text,
  social_follows.user_id,
  profile.username,
  profile.display_name,
  profile.avatar_url,
  profile.last_fm_avatar_url,
  profile.avatar_release_group_name,
  profile.avatar_artist_name,
  null::text as artist_mbid,
  null::text as release_group_mbid,
  null::text as recording_mbid,
  null::text as artist_name,
  null::text as release_group_name,
  null::text as recording_name,
  null::text as user_added_artist_name,
  null::text as user_added_release_group_name,
  null::text as user_added_recording_name,
  null::text as episode_title,
  null::text as show_title,
  null::text as status,
  social_follows.updated_at as "timestamp",
  social_follows.updated_at,
  null::text as listen_url,
  null::text as embed_id,
  null::text as embed_source,
  null::text as embed_account,
  null::bigint as user_added_metadata_id,
  null::bigint[] as replies,
  null::bigint as reaction_count,
  null::uuid[] as reaction_user_ids,
  null::bigint as reaction_post_id,
  null::timestamp with time zone as reaction_post_created_at,
  null::uuid as reaction_post_user_id,
  null::text as reaction_post_username,
  null::text as reaction_post_display_name,
  null::text as reaction_post_type,
  null::text as reaction_post_status,
  null::bigint as parent_post_id,
  null::timestamp with time zone as parent_post_created_at,
  null::uuid as parent_post_user_id,
  null::text as parent_post_username,
  null::text as parent_post_display_name,
  null::text as parent_post_type,
  null::text as parent_post_status,
  null::bigint as reply_to,
  null::uuid as reply_to_user_id,
  null::text as reply_to_username,
  null::text as reply_to_display_name,
  null::timestamp with time zone as reply_to_created_at,
  null::bigint as reaction_id,
  null::boolean as reaction_active,
  social_follows.id as follow_id,
  social_follows.target_user_id,
  social_follows.target_username,
  social_follows.target_display_name,
  social_follows.follows_now,
  null::bigint as collection_follow_id,
  null::bigint as collection_id,
  null::text as collection_title,
  null::text as collection_status,
  null::uuid as collection_owner_id,
  null::bigint as collection_edit_id,
  null::boolean as is_top_albums
from
  follows social_follows
  left join profile_display profile on profile.user_id = social_follows.user_id
where
  social_follows.follows_now = true
union
select
  'collection_follow'::text as item_type,
  null::bigint as post_id,
  null::text as text,
  collection_follows.user_id,
  profile.username,
  profile.display_name,
  profile.avatar_url,
  profile.last_fm_avatar_url,
  profile.avatar_release_group_name,
  profile.avatar_artist_name,
  null::text as artist_mbid,
  null::text as release_group_mbid,
  null::text as recording_mbid,
  null::text as artist_name,
  null::text as release_group_name,
  null::text as recording_name,
  null::text as user_added_artist_name,
  null::text as user_added_release_group_name,
  null::text as user_added_recording_name,
  null::text as episode_title,
  null::text as show_title,
  null::text as status,
  collection_follows.updated_at as "timestamp",
  collection_follows.updated_at,
  null::text as listen_url,
  null::text as embed_id,
  null::text as embed_source,
  null::text as embed_account,
  null::bigint as user_added_metadata_id,
  null::bigint[] as replies,
  null::bigint as reaction_count,
  null::uuid[] as reaction_user_ids,
  null::bigint as reaction_post_id,
  null::timestamp with time zone as reaction_post_created_at,
  null::uuid as reaction_post_user_id,
  null::text as reaction_post_username,
  null::text as reaction_post_display_name,
  null::text as reaction_post_type,
  null::text as reaction_post_status,
  null::bigint as parent_post_id,
  null::timestamp with time zone as parent_post_created_at,
  null::uuid as parent_post_user_id,
  null::text as parent_post_username,
  null::text as parent_post_display_name,
  null::text as parent_post_type,
  null::text as parent_post_status,
  null::bigint as reply_to,
  null::uuid as reply_to_user_id,
  null::text as reply_to_username,
  null::text as reply_to_display_name,
  null::timestamp with time zone as reply_to_created_at,
  null::bigint as reaction_id,
  null::boolean as reaction_active,
  null::bigint as follow_id,
  null::uuid as target_user_id,
  null::text as target_username,
  null::text as target_display_name,
  collection_follows.follows_now,
  collection_follows.id as collection_follow_id,
  collection_follows.collection_id,
  collection_follows.collection_title,
  collection_follows.collection_status,
  collection_follows.collection_owner_id,
  null::bigint as collection_edit_id,
  null::boolean as is_top_albums
from
  follows collection_follows
  left join profile_display profile on profile.user_id = collection_follows.user_id
where
  collection_follows.collection_status <> 'deleted'::text
  and (
    collection_follows.collection_status = 'open'::text
    or collection_follows.collection_status = 'public'::text
    or collection_follows.collection_status = 'private'::text
    and (
      collection_follows.user_role = 'owner'::text
      or collection_follows.user_role = 'collaborator'::text
    )
    and not (
      collection_follows.follows_now = true
      and collection_follows.user_role = 'owner'::text
    )
  )
union
select
  'collection_edit'::text as item_type,
  null::bigint as post_id,
  null::text as text,
  collection_activity.user_id,
  profile.username,
  profile.display_name,
  profile.avatar_url,
  profile.last_fm_avatar_url,
  profile.avatar_release_group_name,
  profile.avatar_artist_name,
  null::text as artist_mbid,
  null::text as release_group_mbid,
  null::text as recording_mbid,
  null::text as artist_name,
  null::text as release_group_name,
  null::text as recording_name,
  null::text as user_added_artist_name,
  null::text as user_added_release_group_name,
  null::text as user_added_recording_name,
  null::text as episode_title,
  null::text as show_title,
  null::text as status,
  collection_activity.updated_at as "timestamp",
  collection_activity.updated_at,
  null::text as listen_url,
  null::text as embed_id,
  null::text as embed_source,
  null::text as embed_account,
  null::bigint as user_added_metadata_id,
  null::bigint[] as replies,
  null::bigint as reaction_count,
  null::uuid[] as reaction_user_ids,
  null::bigint as reaction_post_id,
  null::timestamp with time zone as reaction_post_created_at,
  null::uuid as reaction_post_user_id,
  null::text as reaction_post_username,
  null::text as reaction_post_display_name,
  null::text as reaction_post_type,
  null::text as reaction_post_status,
  null::bigint as parent_post_id,
  null::timestamp with time zone as parent_post_created_at,
  null::uuid as parent_post_user_id,
  null::text as parent_post_username,
  null::text as parent_post_display_name,
  null::text as parent_post_type,
  null::text as parent_post_status,
  null::bigint as reply_to,
  null::uuid as reply_to_user_id,
  null::text as reply_to_username,
  null::text as reply_to_display_name,
  null::timestamp with time zone as reply_to_created_at,
  null::bigint as reaction_id,
  null::boolean as reaction_active,
  null::bigint as follow_id,
  null::uuid as target_user_id,
  null::text as target_username,
  null::text as target_display_name,
  null::boolean as follows_now,
  null::bigint as collection_follow_id,
  collection_activity.collection_id,
  collection_activity.collection_title,
  collection_activity.status as collection_status,
  collection_activity.collection_owner_id,
  collection_activity.id as collection_edit_id,
  collection_activity.is_top_albums
from
  collection_activity
  left join follows collection_follows on collection_follows.collection_id = collection_activity.collection_id
  left join profile_display profile on profile.user_id = collection_activity.user_id
where
  collection_follows.collection_status <> 'deleted'::text
  and (
    collection_follows.collection_status = 'open'::text
    or collection_follows.collection_status = 'public'::text
    or collection_follows.collection_status = 'private'::text
    and (
      collection_follows.user_role = 'owner'::text
      or collection_follows.user_role = 'collaborator'::text
    )
  );

create view public.follows as
select
  'social'::text as follow_type,
  social_graph.id,
  social_graph.user_id,
  profile.username,
  profile.display_name,
  social_graph.target_user_id,
  social_graph.follows_now,
  social_graph.updated_at,
  target_user.username as target_username,
  target_user.display_name as target_display_name,
  blocks.active as user_blocked,
  null::bigint as collection_id,
  null::text as collection_title,
  null::text as collection_status,
  null::uuid as collection_owner_id,
  null::text as user_role,
  null::uuid[] as collection_collaborators
from
  social_graph
  left join profiles profile on social_graph.user_id = profile.id
  left join profiles target_user on social_graph.target_user_id = target_user.id
  left join user_moderation_actions blocks on blocks.user_id = social_graph.target_user_id
  and blocks.target_user_id = social_graph.user_id
  and blocks.type = 'block'::text
where
  social_graph.follows_now = true
union
select
  'collection'::text as follow_type,
  social.id,
  social.user_id,
  profile.username,
  profile.display_name,
  null::uuid as target_user_id,
  social.follows_now,
  social.updated_at,
  null::text as target_username,
  null::text as target_display_name,
  null::boolean as user_blocked,
  social.collection_id,
  collection.title as collection_title,
  collection.status as collection_status,
  collection.owner_id as collection_owner_id,
  social.user_role,
  follows.collaborators as collection_collaborators
from
  social_graph social
  left join collection_follows follows on social.collection_id = follows.collection_id
  left join profiles profile on social.user_id = profile.id
  left join collections_info collection on social.collection_id = collection.collection_id
where
  social.follows_now = true;

create view public.posts_and_engagement as
select
  post.id,
  post.text,
  post.user_id,
  post.artist_mbid,
  post.release_group_mbid,
  post.recording_mbid,
  post_artist.artist_name,
  post_release_group.release_group_name,
  post_recording.recording_name,
  post.user_added_metadata_id,
  user_added_metadata.artist_name as user_added_artist_name,
  user_added_metadata.release_group_name as user_added_release_group_name,
  user_added_metadata.recording_name as user_added_recording_name,
  user_added_metadata.episode_title,
  user_added_metadata.show_title,
  post.status,
  post.type,
  post.created_at,
  post.updated_at,
  post.listen_url,
  post.embed_id,
  post.embed_source,
  post.embed_account,
  post.item_type,
  post.parent_post_id,
  parent_post.created_at as parent_post_created_at,
  parent_post.type as parent_post_type,
  parent_post.status as parent_post_status,
  parent_post.user_id as parent_post_user_id,
  parent_post_profile.username as parent_post_username,
  parent_post_profile.display_name as parent_post_display_name,
  profile.username,
  profile.display_name,
  avatar_release_group.img_url as avatar_url,
  avatar_release_group.last_fm_img_url as last_fm_avatar_url,
  avatar_release_group.release_group_name as avatar_release_group_name,
  avatar_artist.artist_name as avatar_artist_name,
  count(distinct reaction.id) as reaction_count,
  array_agg(distinct reaction.user_id) as reaction_user_ids,
  post.reply_to,
  reply_to_post.user_id as reply_to_user_id,
  reply_to_post.created_at as reply_to_created_at,
  reply_to_profile.username as reply_to_username,
  reply_to_profile.display_name as reply_to_display_name,
  array_agg(distinct child_post.id) as replies,
  post.parent_collection_id,
  parent_collection.owner_id as parent_collection_owner_id,
  parent_collection.title as parent_collection_title
from
  posts post
  left join profiles profile on profile.id = post.user_id
  left join posts parent_post on parent_post.id = post.parent_post_id
  left join profiles parent_post_profile on parent_post_profile.id = parent_post.user_id
  left join release_groups avatar_release_group on avatar_release_group.release_group_mbid = profile.avatar_mbid
  left join artists avatar_artist on avatar_artist.artist_mbid = avatar_release_group.artist_mbid
  left join release_groups post_release_group on post_release_group.release_group_mbid = post.release_group_mbid
  left join artists post_artist on post_artist.artist_mbid = post.artist_mbid
  left join recordings post_recording on post_recording.recording_mbid = post.recording_mbid
  left join user_added_metadata on user_added_metadata.id = post.user_added_metadata_id
  left join reactions reaction on reaction.post_id = post.id
  and reaction.active = true
  left join posts child_post on child_post.parent_post_id = post.id
  left join posts reply_to_post on reply_to_post.id = post.reply_to
  left join profiles reply_to_profile on reply_to_post.user_id = reply_to_profile.id
  left join collections_info parent_collection on parent_collection.collection_id = post.parent_collection_id
where
  post.status = 'new'::text
  or post.status = 'edited'::text
group by
  post.id,
  profile.username,
  profile.display_name,
  avatar_release_group.img_url,
  avatar_release_group.last_fm_img_url,
  avatar_release_group.release_group_name,
  avatar_artist.artist_name,
  parent_post.user_id,
  parent_post_profile.username,
  parent_post_profile.display_name,
  parent_post.created_at,
  parent_post.type,
  parent_post.status,
  post_artist.artist_name,
  post_release_group.release_group_name,
  post_recording.recording_name,
  user_added_metadata.artist_name,
  user_added_metadata.release_group_name,
  user_added_metadata.recording_name,
  user_added_metadata.episode_title,
  user_added_metadata.show_title,
  reply_to_post.user_id,
  reply_to_post.created_at,
  reply_to_profile.username,
  reply_to_profile.display_name,
  parent_collection.owner_id,
  parent_collection.title;

create view public.profile_display as
select
  profile.id as user_id,
  profile.username,
  profile.display_name,
  profile.about,
  profile.website,
  profile.updated_at,
  avatar_release_group.img_url as avatar_url,
  avatar_release_group.last_fm_img_url as last_fm_avatar_url,
  avatar_release_group.release_group_name as avatar_release_group_name,
  avatar_artist.artist_name as avatar_artist_name,
  count(social_follows.target_user_id) as following_count,
  array_agg(social_follows.target_user_id) as users_following
from
  profiles profile
  left join release_groups avatar_release_group on avatar_release_group.release_group_mbid = profile.avatar_mbid
  left join artists avatar_artist on avatar_artist.artist_mbid = avatar_release_group.artist_mbid
  left join follows social_follows on social_follows.user_id = profile.id
  and (
    social_follows.user_blocked is null
    or social_follows.user_blocked = false
  )
group by
  profile.id,
  avatar_release_group.img_url,
  avatar_release_group.last_fm_img_url,
  avatar_release_group.release_group_name,
  avatar_artist.artist_name;

create view public.reactions_metadata as
select
  reaction.id,
  reaction.user_id,
  reaction.post_id as reaction_post_id,
  reaction.reaction as reaction_type,
  reaction.updated_at,
  reaction.active,
  reaction_profile.username,
  reaction_profile.display_name,
  reaction_profile.avatar_url,
  reaction_profile.last_fm_avatar_url,
  reaction_profile.avatar_release_group_name,
  reaction_profile.avatar_artist_name,
  reaction_post.user_id as reaction_post_user_id,
  reaction_post.created_at as reaction_post_created_at,
  reaction_post.username as reaction_post_username,
  reaction_post.display_name as reaction_post_display_name,
  reaction_post.type as reaction_post_type,
  reaction_post.status as reaction_post_status,
  reaction_post.artist_name as reaction_post_artist_name,
  reaction_post.user_added_artist_name as reaction_post_user_added_artist_name,
  reaction_post.release_group_name as reaction_post_release_group_name,
  reaction_post.user_added_release_group_name as reaction_post_user_added_release_group_name,
  reaction_post.recording_name as reaction_post_recording_name,
  reaction_post.user_added_recording_name as reaction_post_user_added_recording_name,
  reaction_post.episode_title as reaction_post_episode_title,
  reaction_post.parent_post_id,
  reaction_post.parent_post_user_id,
  reaction_post.parent_post_created_at,
  reaction_post.parent_post_username,
  reaction_post.parent_post_display_name,
  reaction_post.parent_post_type,
  reaction_post.parent_post_status,
  reaction.collection_id,
  reaction_collection.title as collection_title,
  reaction_collection.owner_id as collection_owner_id
from
  reactions reaction
  left join profile_display reaction_profile on reaction_profile.user_id = reaction.user_id
  left join posts_and_engagement reaction_post on reaction_post.id = reaction.post_id
  left join collections_info reaction_collection on reaction.collection_id = reaction_collection.collection_id
where
  reaction.active = true
  and (
    reaction.collection_id is not null
    or (
      reaction_post.status = 'new'::text
      or reaction_post.status = 'edited'::text
    )
    and (
      reaction_post.parent_post_status = 'new'::text
      or reaction_post.parent_post_status = 'edited'::text
      or reaction_post.parent_post_status is null
    )
  );