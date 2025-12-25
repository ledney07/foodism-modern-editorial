import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

type Comment = {
  id: string;
  author: string;
  text: string;
  date: string;
  replies?: Comment[];
};

type CommentsProps = {
  articleId: string;
  className?: string;
};

const Comments = ({ articleId, className = '' }: CommentsProps): React.ReactElement => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load comments from localStorage
    const stored = localStorage.getItem(`comments-${articleId}`);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading comments:', e);
      }
    }
  }, [articleId]);

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    localStorage.setItem(`comments-${articleId}`, JSON.stringify(updatedComments));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName,
      text: newComment,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      replies: [],
    };

    saveComments([...comments, comment]);
    setNewComment('');
  };

  const handleReply = (commentId: string, replyText: string, replyAuthor: string) => {
    if (!replyText.trim() || !replyAuthor.trim()) return;

    const reply: Comment = {
      id: Date.now().toString(),
      author: replyAuthor,
      text: replyText,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      return comment;
    });

    saveComments(updatedComments);
  };

  if (!isOpen) {
    return (
      <div className={className}>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 text-neutral-600 hover:text-[#f9b233] transition-colors group"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-medium">Comments ({comments.length})</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white border-t border-neutral-100 pt-12 mt-16 ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-serif text-3xl font-black">Comments ({comments.length})</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Close comments"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 p-6 bg-neutral-50 rounded-lg">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-3 border-b-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none bg-transparent text-sm font-medium"
            required
          />
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-b-2 border-neutral-200 focus:border-[#f9b233] focus:outline-none bg-transparent text-sm font-light resize-none"
            required
          />
          <button
            type="submit"
            className="flex items-center space-x-2 bg-[#f9b233] text-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-[#e5a022] transition-colors"
          >
            <span>Post Comment</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <p className="text-neutral-400 text-center py-12">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

type CommentItemProps = {
  comment: Comment;
  onReply: (commentId: string, replyText: string, replyAuthor: string) => void;
};

const CommentItem = ({ comment, onReply }: CommentItemProps): React.ReactElement => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyAuthor.trim()) return;
    onReply(comment.id, replyText, replyAuthor);
    setReplyText('');
    setReplyAuthor('');
    setShowReplyForm(false);
  };

  return (
    <div className="border-b border-neutral-100 pb-8 last:border-0">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-[#f9b233] flex items-center justify-center flex-shrink-0">
          <span className="text-black font-black text-sm">
            {comment.author.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-black text-sm">{comment.author}</span>
            <span className="text-neutral-400 text-xs">{comment.date}</span>
          </div>
          <p className="text-neutral-700 font-light leading-relaxed mb-4">{comment.text}</p>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs text-[#f9b233] font-bold uppercase tracking-widest hover:underline"
          >
            Reply
          </button>

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  className="w-full px-3 py-2 border-b border-neutral-200 focus:border-[#f9b233] focus:outline-none bg-transparent text-xs"
                  required
                />
                <textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border-b border-neutral-200 focus:border-[#f9b233] focus:outline-none bg-transparent text-xs resize-none"
                  required
                />
                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    className="text-xs bg-[#f9b233] text-black px-4 py-2 font-black uppercase tracking-widest hover:bg-[#e5a022] transition-colors"
                  >
                    Post Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText('');
                      setReplyAuthor('');
                    }}
                    className="text-xs text-neutral-400 hover:text-neutral-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-6 ml-6 pl-6 border-l-2 border-neutral-100 space-y-6">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-neutral-600 font-black text-xs">
                      {reply.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-bold text-xs">{reply.author}</span>
                      <span className="text-neutral-400 text-xs">{reply.date}</span>
                    </div>
                    <p className="text-neutral-600 text-sm font-light leading-relaxed">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;

