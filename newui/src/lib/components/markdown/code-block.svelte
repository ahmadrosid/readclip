<script lang="ts">
  import Copy from "lucide-svelte/icons/copy";

  let pre: HTMLPreElement;
  let showCopied = false;

  function copyToClipboard() {
    if (pre) {
      navigator.clipboard.writeText(pre.textContent || "");
      showCopied = true;
      setTimeout(() => (showCopied = false), 2000);
    }
  }
</script>

<div class="p-0 bg-gray-900 rounded-md overflow-hidden font-mono">
  <div
    class="flex justify-between items-center px-4 py-2 bg-gray-700/75 text-gray-400"
  >
    <div></div>
    <div class="flex items-center space-x-2">
      <button
        on:click={copyToClipboard}
        class="text-[10px] p-1 rounded hover:bg-gray-700 transition-colors duration-200 flex items-center"
      >
        {#if showCopied}
          <span class="text-gray-400">Copied!</span>
        {:else}
          <Copy size={12} class="mr-1" />
          Copy
        {/if}
      </button>
    </div>
  </div>
  <pre class="my-0 text-sm" bind:this={pre}><slot /></pre>
</div>
