import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  // Code blocks and inline code
  code({ inline, className, children, ...props }) {
    const lang = className?.replace("language-", "") || "";

    if (inline) {
      return (
        <code
          className="font-mono text-[0.85em] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="my-3 rounded border border-slate-200 dark:border-slate-600 overflow-hidden">
        {lang && (
          <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">
              {lang}
            </span>
          </div>
        )}
        <pre className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 overflow-x-auto">
          <code
            className="font-mono text-[13px] leading-relaxed text-slate-800 dark:text-slate-200"
            {...props}
          >
            {children}
          </code>
        </pre>
      </div>
    );
  },

  // Paragraphs
  p({ children }) {
    return <p className="my-2 first:mt-0 last:mb-0">{children}</p>;
  },

  // Headers — serif, scaled down
  h1({ children }) {
    return (
      <h1 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-2 first:mt-0">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="font-serif text-base font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-2 first:mt-0">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="font-serif text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-1.5 first:mt-0">
        {children}
      </h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="font-serif text-sm font-medium text-slate-700 dark:text-slate-300 mt-3 mb-1 first:mt-0">
        {children}
      </h4>
    );
  },

  // Lists
  ul({ children }) {
    return <ul className="my-2 pl-5 list-disc space-y-1">{children}</ul>;
  },
  ol({ children }) {
    return (
      <ol className="my-2 pl-5 list-decimal space-y-1">{children}</ol>
    );
  },
  li({ children }) {
    return <li className="text-slate-700 dark:text-slate-300">{children}</li>;
  },

  // Links — teal accent
  a({ href, children }) {
    return (
      <a
        href={href}
        className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline underline-offset-2 decoration-teal-300 dark:decoration-teal-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },

  // Blockquote
  blockquote({ children }) {
    return (
      <blockquote className="my-3 pl-3 border-l-2 border-teal-300 dark:border-teal-700 text-slate-600 dark:text-slate-400 italic">
        {children}
      </blockquote>
    );
  },

  // Horizontal rule
  hr() {
    return <hr className="my-4 border-slate-200 dark:border-slate-700" />;
  },

  // Strong / em
  strong({ children }) {
    return <strong className="font-semibold text-slate-900 dark:text-slate-100">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic">{children}</em>;
  },

  // Table
  table({ children }) {
    return (
      <div className="my-3 overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-600">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>;
  },
  th({ children }) {
    return (
      <th className="px-3 py-1.5 text-left font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
        {children}
      </td>
    );
  },
};

function Markdown({ content }) {
  return (
    <div className="font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default React.memo(Markdown);
