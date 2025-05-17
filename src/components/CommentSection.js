import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { addCommentToVideo, toggleCommentLike, addCommentReply, editComment, deleteComment } from '../services/apiService';
import '../styles/CommentSection.css';

const CommentSection = ({ comments: initialComments, videoId, currentUser }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const commentInputRef = useRef(null);
  const observerRef = useRef(null);
  const { connect, subscribe, send } = useWebSocket();

  // Available reactions
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    const cleanup = connect(videoId);

    const handleNewComment = (data) => {
      setComments(prev => [data.comment, ...prev]);
    };

    const handleDeleteComment = (data) => {
      setComments(prev => prev.filter(comment => comment._id !== data.commentId));
    };

    const handleEditComment = (data) => {
      setComments(prev => prev.map(comment =>
        comment._id === data.commentId
          ? { ...comment, content: data.content }
          : comment
      ));
    };

    const handleReaction = (data) => {
      setComments(prev => prev.map(comment =>
        comment._id === data.commentId
          ? {
            ...comment,
            reactions: {
              ...comment.reactions,
              [data.reaction]: comment.reactions[data.reaction]
                ? [...comment.reactions[data.reaction], data.userId]
                : [data.userId]
            }
          }
          : comment
      ));
    };

    const unsubscribeNew = subscribe('new_comment', handleNewComment);
    const unsubscribeDelete = subscribe('delete_comment', handleDeleteComment);
    const unsubscribeEdit = subscribe('edit_comment', handleEditComment);
    const unsubscribeReaction = subscribe('reaction', handleReaction);

    return () => {
      cleanup();
      unsubscribeNew();
      unsubscribeDelete();
      unsubscribeEdit();
      unsubscribeReaction();
    };
  }, [videoId, connect, subscribe]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, page]);

  useEffect(() => {
    if (hasMore) {
      loadMoreComments();
    }
  }, [hasMore, loadMoreComments]);

  const loadMoreComments = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/videos/${videoId}/comments?page=${page + 1}&sort=${sortBy}`);
      const data = await response.json();

      if (data.comments.length === 0) {
        setHasMore(false);
      } else {
        setComments(prev => [...prev, ...data.comments]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setError('Failed to load more comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = async (newSort) => {
    setSortBy(newSort);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/videos/${videoId}/comments?sort=${newSort}`);
      const data = await response.json();
      setComments(data.comments);
      setPage(1);
      setHasMore(true);
    } catch (err) {
      setError('Failed to sort comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (newComment.trim() === '') return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await addCommentToVideo(videoId, { content: newComment });
      send({
        type: 'new_comment',
        comment: response.data.comment
      });
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (parentId, replyContent) => {
    if (replyContent.trim() === '') return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await addCommentReply(videoId, parentId, { content: replyContent });
      send({
        type: 'new_comment',
        comment: response.data
      });
      setReplyingTo(null);
    } catch (err) {
      setError('Failed to add reply');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (commentId, newContent) => {
    if (newContent.trim() === '') return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await editComment(commentId, { content: newContent });
      send({
        type: 'edit_comment',
        commentId,
        content: response.data.content
      });
      setEditingComment(null);
    } catch (err) {
      setError('Failed to edit comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsLoading(true);
    setError(null);
    try {
      await deleteComment(commentId);
      send({
        type: 'delete_comment',
        commentId
      });
    } catch (err) {
      setError('Failed to delete comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (commentId, reaction) => {
    try {
      await toggleCommentLike(commentId, { reaction });
      send({
        type: 'reaction',
        commentId,
        reaction,
        userId: currentUser._id
      });
    } catch (err) {
      setError('Failed to add reaction');
    }
  };

  const renderComment = (comment, level = 0) => {
    const isEditing = editingComment === comment._id;
    const isReplying = replyingTo === comment._id;

    return (
      <div
        key={comment._id}
        className={`comment-item level-${level}`}
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Comment content rendering code */}
      </div>
    );
  };

  return (
    <div>
      {/* Comment section rendering code */}
    </div>
  );
};

export default CommentSection;