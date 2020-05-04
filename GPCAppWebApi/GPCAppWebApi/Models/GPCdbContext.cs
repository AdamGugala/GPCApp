using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.SqlServer.Infrastructure.Internal;
using Microsoft.Extensions.Configuration;

namespace GPC.NETCore.Models
{
    public partial class GPCdbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public GPCdbContext()
        {
        }

        public GPCdbContext(DbContextOptions<GPCdbContext> options)
            : base(options)
        {
        }

        public GPCdbContext(DbContextOptions<GPCdbContext> options, IConfiguration configuration) 
            : base(options)
        {
            _configuration = configuration;
        }

        public virtual DbSet<LsteamGamesId> LsteamGamesId { get; set; }
        public virtual DbSet<LsteamGamesIdBackup> LsteamGamesIdBackup { get; set; }
        public virtual DbSet<SteamGamesIdView> SteamGamesIdView { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // For reference. Options are injected through constructor (used in Steam controller). Below if will not be true.
            if (!optionsBuilder.IsConfigured)
            {  
                optionsBuilder.UseSqlServer(_configuration.GetConnectionString("Connection1"));
                optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LsteamGamesId>(entity =>
            {
                entity.ToTable("LSteamGamesId");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.DateMod)
                    .HasColumnName("dateMod")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<LsteamGamesIdBackup>(entity =>
            {
                entity.ToTable("LSteamGamesIdBackup");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .ValueGeneratedNever();

                entity.Property(e => e.DateMod)
                    .HasColumnName("dateMod")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<SteamGamesIdView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("SteamGamesIdView");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(100);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
